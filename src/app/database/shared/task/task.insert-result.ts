
import { InsertResult } from '../insert-result';
import { KanbanTask } from '../kanban-task/kanban-task';
import { Task } from './task';

export class TaskInsertResult extends InsertResult<Task>{

  private _insertedKanbanTask: KanbanTask;
  private _updatedKanabanTasks: KanbanTask[] = [];

  constructor(insertedTask: Task, updatedTasks=[]){
    super(insertedTask, updatedTasks);
  }

  public get insertedKanbanTask(): KanbanTask{
    return this._insertedKanbanTask;
  }

  public set insertedKanbanTask(task: KanbanTask){
    this._insertedKanbanTask = task;
  }

  public get updatedKanbanTasks(): KanbanTask[]{
    return this._updatedKanabanTasks;
  }

  public set updatedKanbanTasks(tasks: KanbanTask[]){
    this._updatedKanabanTasks = tasks;
  }

}
