import { EventBus } from 'eventbus-ts';
import { Task } from 'app/database/data/models/task';

export class TaskDetailsSaveEvent extends EventBus.Event<Task>{

}
