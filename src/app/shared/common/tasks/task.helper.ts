import { Status } from 'app/database/data/models/status';
import { Task } from 'app/database/data/models/task';

export class TaskHelper{
  public static isActive(task: Task){
    return task.getStatus() != Status.ENDED && task.getStatus() != Status.CANCELED;
  }
}
