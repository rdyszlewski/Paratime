import { Status } from '../data/models/status';
import { Task } from '../data/models/task';
import { TaskFilter } from '../filter/task.filter';
import { TaskInsertData } from '../model/task.insert-data';
import { TaskInsertResult } from '../model/task.insert-result';

export interface ITaskService{
  getById(id: number): Promise<Task>;
  getByName(name: string): Promise<Task[]>;
  getByFilter(filter: TaskFilter): Promise<Task[]>;
  getByProject(projectId: number): Promise<Task[]>;
  getAll(): Promise<Task[]>;
  create(data: TaskInsertData): Promise<TaskInsertResult>;
  remove(task:Task): Promise<Task[]>;
  update(task: Task): Promise<Task>;
  changeStatus(task: Task, status: Status): Promise<Task[]>;
  changeProject(currentTask: Task, previousTask: Task, projectId: number): Promise<Task[]>;
  // change order (move up or down on the list) of tasks, returns all tasks, with changed order
  changeOrder(currentTask: Task, previousTask: Task, currentIndex: number, previousIndex: number):Promise<Task[]>;
  // TODO: sprawdzić, czy potrzebne będą te metody insert i remove, który były w TaskStore
}
