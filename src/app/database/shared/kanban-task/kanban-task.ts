import { IFilterable } from 'app/shared/common/filter/filterable';
import { OrderableItem } from '../models/orderable.item';
import { Task } from '../task/task';
import { ITaskItem } from '../task/task.item';

export class KanbanTask extends OrderableItem implements IFilterable, ITaskItem{

  private taskId: number;
  private columnId: number;
  private task: Task;

  public getTaskId(): number {
    return this.taskId;
  }

  public setTaskId(taskId: number) {
    this.taskId = taskId;
  }

  public getName(): string {
    if (this.task) {
      return this.task.getName();
    }
  }

  public setName(name: string): void {
    if(this.task){
      this.task.setName(name);
    }
  }

  public getColumnId(): number {
    return this.columnId;
  }

  public setColumnId(columnId: number) {
    this.columnId = columnId;
  }

  public getTask() {
    return this.task;
  }

  public setTask(task: Task) {
    this.task = task;
    if (task) {
      this.taskId = task.getId();
    }
  }

  public getContainerId(): number {
    return this.getColumnId();
  }

  public setContainerId(id: number): void {
    this.setColumnId(id);
  }
}
