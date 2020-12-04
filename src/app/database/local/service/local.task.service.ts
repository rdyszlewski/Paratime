import { ILabelService } from 'app/database/common/label.service';
import { ISubtaskService } from 'app/database/common/subtask.service';
import { ITaskService } from 'app/database/common/task.service';
import { KanbanColumn, KanbanTask } from 'app/database/data/models/kanban';
import { Label } from 'app/database/data/models/label';
import { Status } from 'app/database/data/models/status';
import { Subtask } from 'app/database/data/models/subtask';
import { Task } from 'app/database/data/models/task';
import { TaskFilter } from 'app/database/filter/task.filter';
import { InsertResult } from 'app/database/model/insert-result';
import { TaskInsertData } from 'app/database/model/task.insert-data';
import { TaskInsertResult } from 'app/database/model/task.insert-result';
import { LocalTaskRepository } from '../repository/local.task.repository';
import { LocalOrderController } from './local.orderable.service';

export class LocalTaskService implements ITaskService{

  private orderController: LocalOrderController<Task>;

  constructor(private repository: LocalTaskRepository,
    private subtaskService: ISubtaskService,
    private labelService: ILabelService){
    this.orderController = new LocalOrderController(repository);
  }

  public getById(id: number): Promise<Task> {
    return this.repository.findById(id).then(task=>{
      return this.fetchTask(task);
    });
  }

  private fetchTask(task: Task): Promise<Task>{
    // TODO: oniecznie sprawdzić, jak to będzie wyglądało w sprawie projektu

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

  public getByName(name: string): Promise<Task[]> {
    return this.repository.findByName(name).then(tasks=>{
      return this.fetchManyTasks(tasks);
    });
  }

  private fetchManyTasks(tasks: Task[]): Promise<Task[]>{
    return Promise.all(tasks.map(task=>this.fetchTask(task)));
  }

  public getByFilter(filter: TaskFilter): Promise<Task[]> {
    return this.repository.findByFilter(filter).then(tasks=>{
      return this.fetchManyTasks(tasks);
    })
  }

  public getByProject(projectId: number): Promise<Task[]>{
    return this.repository.findByProject(projectId).then(tasks=>{
      return this.fetchManyTasks(tasks);
    })
  }

  public getAll(): Promise<Task[]> {
    // without fetching
    return this.repository.findAll();
  }

  public create(data: TaskInsertData): Promise<TaskInsertResult> {
    // TODO: wstawienie zadania
    // TODO: wstawienie wstawienie podzadań, połączenia z etykietami, zadaniae kanban
    // TODO: zrobić kolejność

    // TODO: sprawdzenie
    return this.insertTask(data.task).then(insertedTask=>{
      return Promise.all([
        this.insertTaskProperties(data.task, insertedTask),
        this.orderController.insert(insertedTask, null, insertedTask.getContainerId()),
        this.insertKanbanTask(insertedTask.getId(), data.column, data.projectId)
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
    console.log("insertTask");
    console.log(task);
    return this.repository.insert(task).then(insertedId=>{
      return this.repository.findById(insertedId);
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
    let actions = [];
    task.getSubtasks().forEach(subtask=>{
      subtask.setTaskId(insertedId);
      actions.push(this.subtaskService.create(subtask));
    })
    return Promise.all(actions).then(results=>{
      return Promise.resolve(results.map(result=>result.insertedElement));
    })
  }

  private insertTaskLabels(task: Task, insertedId: number): Promise<Label[]>{
    let actions = task.getLabels().map(label=>this.labelService.assginLabel(insertedId, label.getId()));
    return Promise.all(actions).then(results=>{
      let labelsIds = results.map(result=>result.getLabelId())
      return Promise.all(labelsIds.map(id => this.labelService.getById(id)));
    })
  }

  private insertKanbanTask(insertedId: number, column: KanbanColumn, projectId: number ): Promise<InsertResult<KanbanTask>>{
    // TODO: napisać tę metodę po dodaniu KanbanTask
    return Promise.resolve(new InsertResult(null));
  }

  public remove(task:Task): Promise<Task[]> {
    return this.removeTaskConnections(task.getId()).then(()=>{
      return this.repository.remove(task.getId()).then(()=>{
        return this.orderController.remove(task);
      });
    })
  }

  private removeTaskConnections(taskId: number): Promise<void>{
    // TODO: dodać usuwanie zadania kanban
    return Promise.all([
      this.labelService.removeAllAssigningFromTask(taskId),
      this.subtaskService.removeByTask(taskId)
    ]).then(_=>{
      return Promise.resolve(null);
    })
  }

  public update(task: Task): Promise<Task> {
    return this.repository.update(task).then(_=>{
      return Promise.resolve(task);
    });
  }

  public changeStatus(task: Task, status: Status): Promise<Task[]> {
    // TODO: czy dla każdego stanu jest oddzielna kolejność?
    // TODO: dokończyć to
    return Promise.resolve([]);
  }

  // TODO: spróbować napisać tę metodą jakos lepiej
  public changeProject(currentTask: Task, previousTask: Task, projectId: number): Promise<Task[]> {
    return this.orderController.changeContainer(previousTask, currentTask, projectId);
  }

  public changeOrder(currentTask: Task, previousTask: Task, currentIndex: number, previousIndex: number): Promise<Task[]> {
    return this.orderController.move(currentTask, previousTask, currentIndex, previousIndex);
  }

}
