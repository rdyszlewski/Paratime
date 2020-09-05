import { EventBus } from 'eventbus-ts';
import { Task } from 'app/data/models/task';

export class TaskDetailsEvent extends EventBus.Event<Task>{

  public getData():Task{
    return this.data;
  }
}
