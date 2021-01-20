import { DataCommand } from 'app/commands/data-commnad';
import { Subtask } from 'app/database/shared/subtask/subtask';
import { TaskDetails } from 'app/tasks/details-container/task-details/model/model';

export class RemoveSubtaskCommand extends DataCommand{

  constructor(private subtask: Subtask, private model: TaskDetails){
    super();
  }

  public execute() {
    this._dataService.getSubtaskService().remove(this.subtask).then(updatedSubtasks=>{
      this.model.updateSubtasks(updatedSubtasks);
    });
  }

  public unExecute() {
    throw new Error('Method not implemented.');
  }

  public getDescription(): string {
    return `Usunięto zadanie ${this.subtask.name}`;
  }
}
