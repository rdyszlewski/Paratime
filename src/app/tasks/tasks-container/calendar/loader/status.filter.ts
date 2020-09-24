import { Status } from 'app/database/data/models/status';
import { Task } from 'app/database/data/models/task';

export interface IStatusFilter{
  isCorrect(task:Task): boolean;
}

export class NoStatusFilter implements IStatusFilter{

  public isCorrect(task: Task): boolean {
    return true;
  }
}

export class ActiveStatusFilter implements IStatusFilter{

  public isCorrect(task: Task): boolean {
    return this.isActiveTask(task);
  }

  private isActiveTask(task: Task){
    return task.getStatus() != Status.ENDED && task.getStatus() != Status.CANCELED;
  }
}
