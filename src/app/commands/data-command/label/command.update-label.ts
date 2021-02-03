import { DataCommand } from 'app/commands/data-commnad';
import { Label } from 'app/database/shared/label/label';
import { LabelsUpdateEvent } from 'app/shared/side-container/labels/events/update.event';
import { EventBus } from 'eventbus-ts';

export class UpdateLabeLCommand extends DataCommand{

  constructor(private label: Label){
    super();
  }

  execute() {
    this._dataService.getLabelService().update(this.label).then(_=>{
      EventBus.getDefault().post(new LabelsUpdateEvent(null));
    });
  }

  unExecute() {
    throw new Error('Method not implemented.');
  }

  getDescription(): string {
    return `Aktualizacja etykiety ${this.label.name}`;
  }
}
