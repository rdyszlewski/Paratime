import { InsertResult } from 'app/database/shared/insert-result';
import { KanbanColumn } from 'app/database/shared/kanban-column/kanban-column';
import { KanbanTask } from 'app/database/shared/kanban-task/kanban-task';
import { Label } from 'app/database/shared/label/label';
import { ILabelService } from 'app/database/shared/label/label.service';
import { Subtask } from 'app/database/shared/subtask/subtask';
import { ISubtaskService } from 'app/database/shared/subtask/subtask.service';
import { Task } from 'app/database/shared/task/task';
import { TaskInsertData } from 'app/database/shared/task/task.insert-data';
import { TaskInsertResult } from 'app/database/shared/task/task.insert-result';
import { TaskRemoveResult } from 'app/database/shared/task/task.remove-result';
import { LocalKanbanColumnRepository } from '../kanban-column/local.kanban-column.repository';
import { DexieKanbanTaskDTO } from '../kanban-task/local.kanban-task';
import { KanbanTaskDTO, LocalKanbanTaskRepository } from '../kanban-task/local.kanban-task.repository';
import { LocalOrderController } from '../order/local.orderable.service';
import { DexieTaskDTO } from './local.task';
import { LocalTaskRepository } from './local.task.repository';

export class LocalTaskDataService{

  protected taskOrderController: LocalOrderController<DexieTaskDTO>;
  protected kanbanTaskOrderController: LocalOrderController<DexieKanbanTaskDTO>;


  constructor(protected taskRepository: LocalTaskRepository, protected kanbanTaskRepository: LocalKanbanTaskRepository,
    protected kanbanColumnRepository : LocalKanbanColumnRepository,
    protected subtaskService: ISubtaskService, protected labelService: ILabelService){
      this.taskOrderController = new LocalOrderController(taskRepository);
      this.kanbanTaskOrderController = new LocalOrderController(kanbanTaskRepository);
  }

  public create(data: TaskInsertData): Promise<TaskInsertResult>{
    let taskDTO = new DexieTaskDTO(data.task);
    console.log(taskDTO);
    return this.insertTask(taskDTO).then(insertedTask=>{
      console.log("Wstawione zadanie");
      console.log(insertedTask);
      return Promise.all([
        this.insertTaskProperties(insertedTask.id, data.task),
        // TODO: sprawdzić, czy to jest poprawne
        // TODO: prawdopodobnie będzie tutaj pobrać
        this.taskOrderController.insert(taskDTO, null, insertedTask.containerId),
        this.insertKanbanTask(insertedTask, data.column, data.projectId)
      ]).then(results=>{
        let filledTask = results[0];
        let updatedTasks = results[1].map(x=>x.getModel());
        let kanbanInsertResult = results[2];
        let result = new TaskInsertResult(filledTask, updatedTasks);
        result.insertedKanbanTask = kanbanInsertResult.insertedElement;
        result.updatedKanbanTasks = kanbanInsertResult.updatedElements;
        result.insertedKanbanTask.task = result.insertedElement;
        // TODO: możliwe, że będzie trzeba tutaj pozmieniać kolejności
        return Promise.resolve(result);
      });
    });
  }

  private insertTask(task: DexieTaskDTO): Promise<DexieTaskDTO>{
    return this.taskRepository.insert(task).then(insertedId=>{
      return this.taskRepository.findById(insertedId);
    })
  }

  // TODO: jak to powinno wyglądać
  private insertTaskProperties(insertedId: number, task: Task): Promise<Task>{
    let actions: [Promise<Subtask[]>, Promise<Label[]>] = [
      this.insertSubtasks(insertedId, task.subtasks),
      this.insertTaskLabels(insertedId, task.labels)
    ]
    return Promise.all(actions).then(results=>{
      // TODO: tutaj może przyda się stworzenie nowe
      let subtasks = results[0];
      let labels = results[1];
      task.subtasks = subtasks;
      task.labels = labels;
      // TODO: sprawdzić, czy zwracać ten sam model, czy inny
      task.id = insertedId;
      // TODO: prawdopodobnie będzie trzbea pobrać zadania dla zaktualizowanych zadań kanban

      return Promise.resolve(task);
    });
  }

  private insertSubtasks(insertedId: number, subtasks: Subtask[]): Promise<Subtask[]>{
    if(subtasks.length == 0){
      return Promise.resolve([]);
    }
    let actions = [];
    subtasks.forEach(subtask=>{
      subtask.taskId = insertedId;
      // TODo: sprawdzić, jak to rozwiązać
      actions.push(this.subtaskService.create(subtask));
    })
    return Promise.all(actions).then(results=>{
      return Promise.resolve(results.map(result=>result.insertedElement));
    })
  }

  private insertTaskLabels(insertedId: number, labels: Label[]): Promise<Label[]>{
    if(labels.length==0){
      return Promise.resolve([]);
    }
    let actions = labels.map(label=>this.labelService.assginLabel(insertedId, label.id));
    return Promise.all(actions).then(labelsIds=>{
      return Promise.all(labelsIds.map(id => this.labelService.getById(id)));
    });
  }

  private insertKanbanTask(insertedTaskDTO: DexieTaskDTO, column: KanbanColumn, projectId: number): Promise<InsertResult<KanbanTask>>{
    // TODO: to może być przeniesione wcześniej
    let taskModel = insertedTaskDTO.getModel();
    let data = new TaskInsertData(taskModel, column, projectId);
    return this.prepareKanbanColumn(data).then(column=>{
      let kanbanTaskDTO = this.getPreparedKanbanTask(taskModel.id, column.id);
      return this.createKanbanTask(kanbanTaskDTO).then(insertedKanbanTask=>{
        return this.kanbanTaskOrderController.insert(insertedKanbanTask, null, column.id).then(updatedTasks=>{
          let kanbanTaskModel = insertedKanbanTask.getModel();
          kanbanTaskModel.task = taskModel;
          let result = new InsertResult(kanbanTaskModel, updatedTasks.map(x=>x.getModel()));
          return Promise.resolve(result);
        })
      });
    });
  }

  private prepareKanbanColumn(data: TaskInsertData):Promise<KanbanColumn>{
    let columnPromise:Promise<KanbanColumn>;
    if(data.column != null){
      console.log("Kolumna istnieje");

        columnPromise = Promise.resolve(data.column);
    } else {
      console.log("Szukanie domyslnej kolumny");
      console.log(data);

      // TODO: nie znajduje domyślej kolumny
      columnPromise = this.kanbanColumnRepository.findDefaultColumn(data.projectId).then((result=>{
        console.log("Domyslna kolumna");
        console.log(result);

        return Promise.resolve(result.getModel());
      }));
    }
    return columnPromise;
  }

  private getPreparedKanbanTask(insertedTaskId: number, columnId: number): KanbanTaskDTO{
    let kanbanTask = new DexieKanbanTaskDTO();
    kanbanTask.taskId = insertedTaskId;
    kanbanTask.columnId = columnId;

    return kanbanTask;
  }

  private createKanbanTask(kanbanTask: KanbanTaskDTO): Promise<KanbanTaskDTO>{
    return this.kanbanTaskRepository.insert(kanbanTask).then(insertedId=>{
      return this.kanbanTaskRepository.findById(insertedId);
    });
  }

  // REMOVING

  public remove(task: Task): Promise<TaskRemoveResult>{
    return Promise.all([
      this.removeTaskConnections(task.id),
      this.removeKanbanTask(task)
    ]).then(results=>{
      let updatedKanbanTasks = results[1];
      return this.removeTask(task).then(updatedTasks=>{
        let result = new TaskRemoveResult(updatedTasks, updatedKanbanTasks);
        return Promise.resolve(result);
      })
    });

  }

  private removeKanbanTask(task: Task): Promise<KanbanTask[]>{
    return this.kanbanTaskRepository.findByTask(task.id).then(kanbanTask=>{
      return this.kanbanTaskRepository.remove(kanbanTask.id).then(()=>{
        return this.kanbanTaskOrderController.remove(kanbanTask).then(result=>{
          return Promise.resolve(result.map(x=>x.getModel()));
        });
      })
    })
  }

  private removeTask(task: Task): Promise<Task[]>{
    return this.taskRepository.remove(task.id).then(()=>{
      let promise = this.taskOrderController.remove(new DexieTaskDTO(task));
      return this.mapToTaskPromise(promise);
    });
  }

  private mapToTaskPromise(dtoPromise: Promise<DexieTaskDTO[]>): Promise<Task[]>{
    return dtoPromise.then(result=>{
      return Promise.resolve(result.map(x=>x.getModel()));
    })
  }

  private removeTaskConnections(taskId: number): Promise<void>{
    // TODO: dodać usuwanie zadania kanban
    return Promise.all([
      this.labelService.removeAllAssigningFromTask(taskId),
      this.subtaskService.removeByTask(taskId)
    ]).then(_=>{
      return Promise.resolve(null);
    });
  }

  protected fetchTask(taskDto: DexieTaskDTO): Promise<Task>{
    // TODO: do fetchowania:
    // -- podzadania
    // -- etykiety
    // -- być moze etap projektu
    // -- być może projekt
    return Promise.all([
      this.subtaskService.getByTask(taskDto.id),
      this.labelService.getLabelsByTask(taskDto.id)
    ]).then(results=>{
      let task = taskDto.getModel();
      let subtasks = results[0];
      task.subtasks = subtasks;
      let labels = results[1];
      task.labels = labels;
      return Promise.resolve(task);
    })
  }
}
