import { DataCommand } from 'app/commands/data-commnad';
import { Label } from 'app/database/shared/label/label';
import { Task } from 'app/database/shared/task/task';

export class RemoveLabelAssignignCommand extends DataCommand{

  constructor(private task: Task, private label: Label){
    super();
  }

  execute() {
    this._dataService.getLabelService().removeAssigning(this.task.id, this.label.id).then(()=>{
      this.task.removeLabel(this.label);
    });
  }

  unExecute() {
    throw new Error('Method not implemented.');
  }

  getDescription(): string {
    return `Usunięcie etykiety ${this.label.name} z zadania ${this.task.name}`
  }


}
