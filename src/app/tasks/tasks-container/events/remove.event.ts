import { EventBus } from 'eventbus-ts';
import { Task } from 'app/database/shared/task/task';

export class TaskRemoveEvent extends EventBus.Event<Task>{

}
