import { EventBus } from 'eventbus-ts';
import { Stage } from 'app/database/data/models/stage';

export class StageDetailsEvent extends EventBus.Event<Stage>{

  public getData():Stage{
    return this.data;
  }
}
