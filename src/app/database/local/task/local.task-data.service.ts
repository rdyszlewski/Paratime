import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY } from '@angular/cdk/overlay/overlay-directives';
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
import { LocalKanbanTaskRepository } from '../kanban-task/local.kanban-task';
import { LocalOrderController } from '../order/local.orderable.service';
import { LocalTaskRepository } from './local.task.repository';

export class LocalTaskDataService{

  protected taskOrderController: LocalOrderController<Task>;
  protected kanbanTaskOrderController: LocalOrderController<KanbanTask>;


  constructor(protected taskRepository: LocalTaskRepository, protected kanbanTaskRepository: LocalKanbanTaskRepository,
    protected kanbanColumnRepository: LocalKanbanColumnRepository,
    protected subtaskService: ISubtaskService, protected labelService: ILabelService){
      this.taskOrderController = new LocalOrderController(taskRepository);
      this.kanbanTaskOrderController = new LocalOrderController(kanbanTaskRepository);
  }

  public create(data: TaskInsertData): Promise<TaskInsertResult>{
    return this.insertTask(data.task).then(insertedTask=>{
      return Promise.all([
        this.insertTaskProperties(data.task, insertedTask),
        this.taskOrderController.insert(insertedTask, null, insertedTask.getContainerId()),
        this.insertKanbanTask(insertedTask, data.column, data.projectId)
      ]).then(results=>{
        let filledTask = results[0];
        let updatedTasks = results[1];
        let kanbanInsertResult = results[2];
        let result = new TaskInsertResult(filledTask, updatedTasks);
        result.insertedKanbanTask = kanbanInsertResult.insertedElement;
        result.updatedKanbanTasks = kanbanInsertResult.updatedElements;
        return Promise.resolve(result);
      });
    });
  }

  private insertTask(task: Task): Promise<Task>{
    return this.taskRepository.insert(task).then(insertedId=>{
      return this.taskRepository.findById(insertedId);
    })
  }

  private insertTaskProperties(taskModel: Task, insertedTask: Task): Promise<Task>{
    let actions: [Promise<Subtask[]>, Promise<Label[]>] = [
      this.insertSubtasks(taskModel, insertedTask.getId()),
      this.insertTaskLabels(taskModel, insertedTask.getId())
    ]
    return Promise.all(actions).then(results=>{
      // TODO: tutaj może przyda się stworzenie nowe
      let subtasks = results[0];
      let labels = results[1];
      insertedTask.setSubtasks(subtasks);
      insertedTask.setLabels(labels);

      return Promise.resolve(insertedTask);
    });
  }

  private insertSubtasks(task: Task, insertedId: number): Promise<Subtask[]>{
    if(task.getSubtasks().length == 0){
      return Promise.resolve([]);
    }
    let actions = [];
    task.getSubtasks().forEach(subtask=>{
      subtask.setTaskId(insertedId);
      // TODo: sprawdzić, jak to rozwiązać
      actions.push(this.subtaskService.create(subtask));
    })
    return Promise.all(actions).then(results=>{
      return Promise.resolve(results.map(result=>result.insertedElement));
    })
  }

  private insertTaskLabels(task: Task, insertedId: number): Promise<Label[]>{
    if(task.getLabels().length==0){
      return Promise.resolve([]);
    }
    let actions = task.getLabels().map(label=>this.labelService.assginLabel(insertedId, label.getId()));
    return Promise.all(actions).then(results=>{
      let labelsIds = results.map(result=>result.getLabelId())
      return Promise.all(labelsIds.map(id => this.labelService.getById(id)));
    })
  }

  private insertKanbanTask(insertedTask: Task, column: KanbanColumn, projectId: number ): Promise<InsertResult<KanbanTask>>{
    let data = new TaskInsertData(insertedTask, column, projectId);
    return this.prepareKanbanColumn(data).then(column=>{
      let kanbanTask = this.getPreparedKanbanTask(data, column.getId());
      return this.createKanbanTask(kanbanTask).then(insertedTask=>{
        console.log("CreateKanbanTask");
        console.log(insertedTask);
        return this.kanbanTaskOrderController.insert(insertedTask, null, column.getId()).then(updatedTasks=>{
          let result = new InsertResult(insertedTask, updatedTasks);
          return Promise.resolve(result);
        })
      });
    });
  }

  private prepareKanbanColumn(data: TaskInsertData):Promise<KanbanColumn>{
    let columnPromise:Promise<KanbanColumn>;
    if(data.column != null){
        columnPromise = Promise.resolve(data.column);
    } else {
      columnPromise = this.kanbanColumnRepository.findDefaultColumn(data.projectId);
    }
    return columnPromise;
  }

  private getPreparedKanbanTask(data: TaskInsertData, columnId: number): KanbanTask{
    let kanbanTask = new KanbanTask();
    // TODO: to trzeba to prześledzić
    kanbanTask.setTask(data.task);
    kanbanTask.setColumnId(columnId);
    return kanbanTask;
  }

  private createKanbanTask(kanbanTask: KanbanTask): Promise<KanbanTask>{
    return this.kanbanTaskRepository.insert(kanbanTask).then(insertedId=>{
      return this.kanbanTaskRepository.findById(insertedId);
    });
  }

  // REMOVING

  public remove(task: Task): Promise<TaskRemoveResult>{
    return Promise.all([
      this.removeTaskConnections(task.getId()),
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
    console.log(task);

    return this.kanbanTaskRepository.findByTask(task.getId()).then(kanbanTask=>{
      console.log(kanbanTask);
      return this.kanbanTaskRepository.remove(kanbanTask).then(()=>{
        return this.kanbanTaskOrderController.remove(kanbanTask);
      })
    })
  }

  private removeTask(task: Task): Promise<Task[]>{
    return this.taskRepository.remove(task).then(()=>{
      return this.taskOrderController.remove(task);
    });
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

  protected fetchTask(task: Task): Promise<Task>{
    // TODO: do fetchowania:
    // -- podzadania
    // -- etykiety
    // -- być moze etap projektu
    // -- być może projekt
    return Promise.all([
      this.subtaskService.getByTask(task.getId()),
      this.labelService.getLabelsByTask(task.getId())
    ]).then(results=>{
      let subtasks = results[0];
      task.setSubtasks(subtasks);
      let labels = results[1];
      task.setLabels(labels);
      return Promise.resolve(task);
    })
  }
}
