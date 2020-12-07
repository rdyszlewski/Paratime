import { DataCommand } from 'app/commands/data-commnad';
import { Label } from 'app/database/shared/label/label';
import { Task } from 'app/database/shared/task/task';

export class AssingLabelCommand extends DataCommand{

  constructor(private labels: Label[], private task: Task){
    super();
  }

  execute() {
    this._dataService.getLabelService().setAssignedLabels(this.task.getId(), this.labels).then(taskLabels=>{
      this.task.setLabels(this.labels);
    });
  }

  unExecute() {
    throw new Error('Method not implemented.');
  }

  getDescription(): string {
    return `Ustawienie etykiet dla zadania ${this.task.getName()}`;
  }
}
