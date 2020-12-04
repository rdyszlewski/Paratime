
import { ILabelService } from 'app/database/common/label.service';
import { ISubtaskService } from 'app/database/common/subtask.service';
import { ITaskService } from 'app/database/common/task.service';
import { Status } from 'app/database/data/models/status';
import { Task } from 'app/database/data/models/task';
import { TaskFilter } from 'app/database/filter/task.filter';
import { LocalKanbanColumnRepository } from '../repository/local.kanban-column.repository';
import { LocalKanbanTaskRepository } from '../repository/local.kanban-task';
import { LocalTaskRepository } from '../repository/local.task.repository';
import { LocalTaskDataService } from './local.task-data.service';

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
    // TODO: dokończyć zmianę statusu
    return Promise.resolve([]);
  }

  // TODO: spróbować napisać tę metodą jakos lepiej
  public changeProject(currentTask: Task, previousTask: Task, projectId: number): Promise<Task[]> {
    return this.taskOrderController.changeContainer(previousTask, currentTask, projectId);
  }

  public changeOrder(currentTask: Task, previousTask: Task, currentIndex: number, previousIndex: number): Promise<Task[]> {
    return this.taskOrderController.move(currentTask, previousTask, currentIndex, previousIndex);
  }
}
