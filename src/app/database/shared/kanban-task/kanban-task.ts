import { IFilterable } from 'app/shared/common/filter/filterable';
import { OrderableItem } from '../models/orderable.item';
import { Task } from '../task/task';
import { ITaskItem } from '../task/task.item';

export class KanbanTask extends OrderableItem implements ITaskItem, IFilterable {

  private _taskId: number;
  private _columnId: number;
  private _task: Task;

  public get id(): number {
    return this._taskId;
  }

  public set id(taskId: number) {
    this._taskId = taskId;
  }

  public get name(): string{
    if(this._task){
      return this._task.name;
    }
    return null;
  }

  public set name(value: string){
    if(this._task){
      this._task.name = value;
    }
  }

  public get columnId(): number {
    return this._columnId;
  }

  public set columnId(columnId: number) {
    this._columnId = columnId;
  }

  public get task() {
    return this._task;
  }

  public set task(task: Task) {
    this._task = task;
    if (task) {
      this._taskId = task.id;
    }
  }

  public get containerId(): number {
    return this._columnId;
  }

  public set containerId(id: number) {
    this._columnId = id;
  }
}
