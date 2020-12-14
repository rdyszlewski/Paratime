
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

export class LocalTaskService extends LocalTaskDataService implements ITaskService{

  constructor(repository: LocalTaskRepository, kanbanTaskRepository: LocalKanbanTaskRepository,
     kanbanColumnRepository: LocalKanbanColumnRepository,
     subtaskService: ISubtaskService,
     labelService: ILabelService){
      super(repository, kanbanTaskRepository, kanbanColumnRepository, subtaskService, labelService)
  }

  public getById(id: number): Promise<Task> {
    return this.taskRepository.findById(id).then(task=>{
      return this.fetchTask(task);
    });
  }

  public getByName(name: string): Promise<Task[]> {
    return this.taskRepository.findByName(name).then(tasks=>{
      return this.fetchManyTasks(tasks);
    });
  }

  private fetchManyTasks(tasks: Task[]): Promise<Task[]>{
    return Promise.all(tasks.map(task=>this.fetchTask(task)));
  }

  public getByFilter(filter: TaskFilter): Promise<Task[]> {
    return this.taskRepository.findByFilter(filter).then(tasks=>{
      return this.fetchManyTasks(tasks);
    })
  }

  public getByProject(projectId: number): Promise<Task[]>{
    return this.taskRepository.findByProject(projectId).then(tasks=>{
      return this.fetchManyTasks(tasks);
    })
  }

  public getAll(): Promise<Task[]> {
    // without fetching
    return this.taskRepository.findAll();
  }

  public update(task: Task): Promise<Task> {
    return this.taskRepository.update(task).then(_=>{
      return Promise.resolve(task);
    });
  }

  public changeStatus(task: Task, status: Status): Promise<Task[]> {
    // TODO: czy dla każdego stanu jest oddzielna kolejność?
    // TODO: zaplanować, w jaki inny sposób można zrobić kolejność, jeżeli mamy zakończone zadania
    // TODO: refaktoryzacja
    let updated = new Set<Task>();
    updated.add(task);
    return this.taskOrderController.remove(task).then(updatedItems=>{
      updatedItems.forEach(item=>updated.add(item));
      let filter = TaskFilter.getBuilder().setProject(task.getProjectID()).setFirst(true).setStatus(status).build();
      return this.taskRepository.findByFilter(filter).then(tasks=>{
        if(tasks.length>0){
          let firstTask = tasks[0];
          task.setStatus(status);
          task.setPosition(Position.HEAD);
          return this.taskOrderController.insert(task, firstTask, task.getContainerId()).then(updatedItems=>{
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
