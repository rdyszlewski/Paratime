import { Status } from 'app/database/data/models/status';
import { Task } from 'app/database/data/models/task';
import { TaskHelper } from 'app/shared/common/tasks/task.helper';

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
    return TaskHelper.isActive(task);
  }
}

export class InactiveStatusFilter implements IStatusFilter{

  isCorrect(task: Task): boolean {
    return !TaskHelper.isActive(task);  }

}
