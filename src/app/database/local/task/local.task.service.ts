
import { ILabelService } from 'app/database/shared/label/label.service';
import { ISubtaskService } from 'app/database/shared/subtask/subtask.service';
import { ITaskService } from 'app/database/shared/task/task.service';
import { Position } from 'app/database/shared/models/orderable.item';
import { Status } from 'app/database/shared/models/status';
import { Task } from 'app/database/shared/task/task';
import { TaskFilter } from 'app/database/shared/task/task.filter';
import { LocalKanbanTaskRepository } from '../kanban-task/local.kanban-task';
import { LocalTaskRepository } from './local.task.repository';
import { LocalTaskDataService } from './local.task-data.service';
import { LocalKanbanColumnRepository } from '../kanban-column/local.kanban-column.repository';
import { DexieTaskDTO } from './local.task';

export class LocalTaskService extends LocalTaskDataService implements ITaskService{

  constructor(private repository: LocalTaskRepository, kanbanTaskRepository: LocalKanbanTaskRepository,
     kanbanColumnRepository: LocalKanbanColumnRepository,
     subtaskService: ISubtaskService,
     labelService: ILabelService){
      super(repository, kanbanTaskRepository, kanbanColumnRepository, subtaskService, labelService)
  }

  public getById(id: number): Promise<Task> {
    return this.repository.findById(id).then(task=>{
      return this.fetchTask(task);
    });
  }

  public getByName(name: string): Promise<Task[]> {
    return this.repository.findByName(name).then(tasks=>{
      // let mappedTasks = this.mapToTasks(tasks);
      return this.fetchManyTasks(tasks);
    });
  }

  private mapToTasks(tasks: DexieTaskDTO[]): Task[]{
    return tasks.map(x=>x.getModel());
  }

  private fetchManyTasks(tasks: Task[]): Promise<Task[]>{
    return Promise.all(tasks.map(task=>this.fetchTask(task)));
  }

  public getByFilter(filter: TaskFilter): Promise<Task[]> {
    return this.repository.findByFilter(filter).then(tasks=>{
      // let mappedTasks = this.mapToTasks(tasks);
      return this.fetchManyTasks(tasks);
    })
  }

  public getByProject(projectId: number): Promise<Task[]>{
    return this.repository.findByProject(projectId).then(tasks=>{
      // let mappedTasks = this.mapToTasks(tasks);
      return this.fetchManyTasks(tasks);
    })
  }

  public getAll(): Promise<Task[]>{
    // without fetching
    return this.repository.findAll();
  }

  public update(task: Task): Promise<Task> {
    return this.repository.update(task).then(_=>{
      return Promise.resolve(task);
    });
  }

  public changeStatus(task: Task, status: Status): Promise<Task[]> {
    // TODO: czy dla każdego stanu jest oddzielna kolejność?
    // TODO: zaplanować, w jaki inny sposób można zrobić kolejność, jeżeli mamy zakończone zadania
    // TODO: refaktoryzacja

    // TODO: sprawdzić jak to działą
    let updated = new Set<Task>();
    updated.add(task);
    return this.taskOrderController.remove(task).then(updatedItems=>{
      updatedItems.forEach(item=>updated.add(item));
      let filter = TaskFilter.getBuilder().setProject(task.projectID).setFirst(true).setStatus(status).build();
      return this.repository.findByFilter(filter).then(tasks=>{
        if(tasks.length>0){
          let firstTask = tasks[0];
          task.status = status;
          task.position = Position.HEAD;
          // TODO: sprawdzić to, dlaczego tutaj przyjmowane są takie typy
          return this.taskOrderController.insert(task, firstTask, task.containerId).then(updatedItems=>{
            updatedItems.forEach(item=>updated.add(item));
            return Promise.resolve(Array.from(updated));
          });
        }
        return Promise.resolve(Array.from(updated));
      })
    })
  }

  // TODO: spróbować napisać tę metodą jakos lepiej
  public changeProject(currentTask: Task, previousTask: Task, projectId: number): Promise<Task[]> {
    return this.taskOrderController.changeContainer(previousTask, currentTask, projectId);
  }

  public changeOrder(currentTask: Task, previousTask: Task, currentIndex: number, previousIndex: number): Promise<Task[]> {
    return this.taskOrderController.move(currentTask, previousTask, currentIndex, previousIndex);
  }
}
