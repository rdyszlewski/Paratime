import { DataCommand } from 'app/commands/data-commnad';
import { Stage } from 'app/database/shared/stage/stage';
import { StageUpdateEvent } from 'app/tasks/details-container/stage-details/events/update.event';
import { EventBus } from 'eventbus-ts';

export class UpdateStageCommand extends DataCommand{

  constructor(private stage: Stage){
    super();
  }

  public execute() {
    this._dataService.getStageService().update(this.stage).then(updatedStage=>{
      EventBus.getDefault().post(new StageUpdateEvent(updatedStage))
    });
  }

  unExecute() {
    throw new Error('Method not implemented.');
  }

  public getDescription(): string {
    return `Aktualizacja etapu ${this.stage.name}`;
  }

}
