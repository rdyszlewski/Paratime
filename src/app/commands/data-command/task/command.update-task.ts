import { DataCommand } from 'app/commands/data-commnad';
import { Task } from 'app/database/shared/task/task';

export class UpdateTaskCommand extends DataCommand{

  constructor(private task: Task){
    super()
  }

  public execute() {
    this._dataService.getTaskService().update(this.task);
  }

  public unExecute() {
    throw new Error('Method not implemented.');
  }

  public getDescription(): string {
    return `Aktualizacja zadania ${this.task.getName()}`;
  }
}
