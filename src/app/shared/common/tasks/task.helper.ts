import { Status } from 'app/database/shared/models/status';
import { Task } from 'app/database/shared/task/task';

export class TaskHelper{
  public static isActive(task: Task){
    return task.getStatus() != Status.ENDED && task.getStatus() != Status.CANCELED;
  }
}
