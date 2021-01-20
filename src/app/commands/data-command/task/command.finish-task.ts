import { DataCommand } from 'app/commands/data-commnad';
import { AppService } from 'app/core/services/app/app.service';
import { Status } from 'app/database/shared/models/status';
import { Task } from 'app/database/shared/task/task';

export class FinishTaskCommand extends DataCommand{

  constructor(private task:Task, private appService: AppService, private callback: (updatedTasks: Task[])=>void){
    super();
  }

  execute() {
    this._dataService.getTaskService().changeStatus(this.task, Status.ENDED).then(updatedTasks=>{
      if(this.appService.getCurrentTask() == this.task){
        this.appService.setCurrentTask(null);
      }
      this.callback(updatedTasks);
    });
  }

  unExecute() {
    throw new Error('Method not implemented.');
  }

  getDescription(): string {
    return `Zakończono zadanie ${this.task.name}`;
  }
}
