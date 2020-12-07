import { DataCommand } from 'app/commands/data-commnad';
import { Task } from 'app/database/shared/task/task';

export class ChangeTaskOrderCommand extends DataCommand{

  constructor(private currentIndex, private previousIndex, private tasks: Task[]){
    super();
  }

  public execute() {
    const currentTask = this.tasks[this.currentIndex];
    const previousTask = this.tasks[this.previousIndex];
    this._dataService.getTaskService().changeOrder(currentTask, previousTask, this.currentIndex, this.previousIndex);
  }

  public unExecute() {
    throw new Error('Method not implemented.');
  }

  public getDescription(): string {
    return "Zmiana kolejności zadań";
  }
}
