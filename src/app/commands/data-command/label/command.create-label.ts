import { DataCommand } from 'app/commands/data-commnad';
import { Label } from 'app/database/shared/label/label';
import { LabelsModel } from 'app/shared/side-container/labels/common/list.model';
import { LabelsUpdateEvent } from 'app/shared/side-container/labels/events/update.event';
import { EventBus } from 'eventbus-ts';

export class CreateLabelCommand extends DataCommand{

  constructor(private label: Label, private model: LabelsModel){
    super();
  }

  public execute() {
    this._dataService.getLabelService().create(this.label).then(result=>{
      this.model.updateLabels(result.updatedElements);
      EventBus.getDefault().post(new LabelsUpdateEvent(null));
    });
  }

  unExecute() {
    throw new Error('Method not implemented.');
  }

  public getDescription(): string {
    return `Utworzono etykietę ${this.label.getName()}`;
  }

}
