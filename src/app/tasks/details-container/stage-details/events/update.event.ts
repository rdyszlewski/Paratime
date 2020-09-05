import { EventBus } from 'eventbus-ts';
import { Stage } from 'app/database/data/models/stage';

export class StageUpdateEvent extends EventBus.Event<Stage>{

}
