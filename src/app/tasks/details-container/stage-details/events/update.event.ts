import { EventBus } from 'eventbus-ts';
import { Stage } from 'app/database/shared/stage/stage';

export class StageUpdateEvent extends EventBus.Event<Stage>{

}
