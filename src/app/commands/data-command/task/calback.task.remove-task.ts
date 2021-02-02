import { Task } from 'app/database/shared/task/task';
import { TaskRemoveResult } from 'app/database/shared/task/task.remove-result';
import { TasksModel } from 'app/tasks/tasks-container/tasks/model';
import { IRemoveTaskCallback } from './callback.remove-task';

export class RemoveTaskCallback implements IRemoveTaskCallback{

  constructor(private model: TasksModel, private task: Task = null){

  }

  execute(results: TaskRemoveResult[]) {
    if(this.task){
      this.model.removeTask(this.task);
    }
    results.forEach(result=>this.model.updateTasks(result.updatedTasks));
  }

  unExecute() {
    throw new Error('Method not implemented.');
  }
}
