import { DataCommand } from 'app/commands/data-commnad';
import { Subtask } from 'app/database/shared/subtask/subtask';
import { TaskDetails } from 'app/tasks/details-container/task-details/model/model';

export class CreateSubtaskCommand extends DataCommand{

  constructor(private subtask: Subtask, private model: TaskDetails){
    super();
  }

  public execute() {
    this._dataService.getSubtaskService().create(this.subtask).then(result=>{
      this.model.updateSubtasks(result.updatedElements);
    })
  }

  unExecute() {
    throw new Error('Method not implemented.');
  }

  public getDescription(): string {
    return `Dodano podzadanie ${this.subtask.name}`;
  }
}
