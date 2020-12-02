import { KanbanTask } from '../data/models/kanban';
import { Task } from '../data/models/task';

export class TaskInsertResult{
  private _insertedTask: Task;
  private _updatedTasks: Task[] = [];
  private _insertedKanbanTask: KanbanTask;
  private _updatedKanabanTasks: KanbanTask[] = [];

  constructor(insertedTask: Task){
    this._insertedTask = insertedTask;
  }

  public get insertedTask(): Task{
    return this.insertedTask;
  }

  public get updatedTasks(): Task[]{
    return this._updatedTasks;
  }

  public set updatedTasks(tasks: Task[]){
    this._updatedTasks = tasks;
  }

  public get insertedKanbanTask(): KanbanTask{
    return this._insertedKanbanTask;
  }

  public set insertedKanbanTask(task: KanbanTask){
    this.insertedKanbanTask = task;
  }

  public get updatedKanbanTasks(): KanbanTask[]{
    return this._updatedKanabanTasks;
  }

  public set updatedKanbanTasks(tasks: KanbanTask[]){
    this._updatedKanabanTasks = tasks;
  }

}
