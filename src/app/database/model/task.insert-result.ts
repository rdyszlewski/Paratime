import { KanbanTask } from '../data/models/kanban';
import { Task } from '../data/models/task';
import { InsertResult } from './insert-result';

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
