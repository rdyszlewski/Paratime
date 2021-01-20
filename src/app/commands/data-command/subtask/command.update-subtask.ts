import { DataCommand } from 'app/commands/data-commnad';
import { Subtask } from 'app/database/shared/subtask/subtask';

export class UpdateSubtaskCommand extends DataCommand{

  constructor(private subtask: Subtask,private closeCallback: ()=>void){
    super();
  }

  public execute() {
    this._dataService.getSubtaskService().update(this.subtask).then(_=>{
      this.closeCallback();
    });
  }

  unExecute() {
    throw new Error('Method not implemented.');
  }

  getDescription(): string {
    return `Zaktualizowano podzadanie ${this.subtask.name}`;
  }
}
