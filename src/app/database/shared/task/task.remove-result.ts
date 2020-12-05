import { KanbanTask } from '../kanban-task/kanban-task';
import { Task } from './task';

export class TaskRemoveResult{

  constructor(private _updatedTasks: Task[], private _updatedKanbanTasks: KanbanTask[]){
  }

  public get updatedTasks(): Task[]{
    return this._updatedTasks;
  }

  public get updatedKanbanTasks(): KanbanTask[]{
    return this._updatedKanbanTasks;
  }

}
