import { KanbanColumn } from '../kanban-column/kanban-column';
import { Task } from './task';

export class TaskInsertData{

  constructor(private _task: Task, private _column: KanbanColumn=null, private _projectId: number=null){

  }

  public get task(): Task{
    return this._task;
  }

  public get column():KanbanColumn{
    return this._column;
  }

  public get projectId(): number{
    return this._projectId;
  }
}
