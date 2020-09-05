import { EventBus } from 'eventbus-ts';
import { DetailsType } from '../details-container.component';

export class OpenDetailsEvent extends EventBus.Event<DetailsType>{

  getData():DetailsType{
    return this.data;
  }
}
