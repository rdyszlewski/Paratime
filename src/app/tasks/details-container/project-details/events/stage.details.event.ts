import { EventBus } from 'eventbus-ts';
import { Stage } from 'app/data/models/stage';

export class StageDetailsEvent extends EventBus.Event<Stage>{

  public getData():Stage{
    return this.data;
  }
}
