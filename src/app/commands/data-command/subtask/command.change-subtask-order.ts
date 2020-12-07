import { DataCommand } from 'app/commands/data-commnad';
import { TaskDetails } from 'app/tasks/details-container/task-details/model/model';

export class ChangeSubtaskOrderCommand extends DataCommand{

  constructor(private currentIndex: number, private previousIndex: number, private model:TaskDetails ){
    super();
  }

  public execute() {
    const currentTask = this.model.getSubtaskByIndex(this.currentIndex);
    const previousTask = this.model.getSubtaskByIndex(this.previousIndex);
    this._dataService.getSubtaskService().changeOrder(currentTask, previousTask, this.currentIndex, this.previousIndex).then(updatedSubtasks=>{
      this.model.updateSubtasks(updatedSubtasks);
    });
  }

  unExecute() {
    throw new Error('Method not implemented.');
  }

  public getDescription(): string {
    return `Zmiana kolejności podzadań`;
  }
}
