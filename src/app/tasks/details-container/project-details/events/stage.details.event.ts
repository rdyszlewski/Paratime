import { EventBus } from 'eventbus-ts';
import { Stage } from 'app/database/shared/stage/stage';

export class StageDetailsEvent extends EventBus.Event<Stage>{

  public getData():Stage{
    return this.data;
  }
}
