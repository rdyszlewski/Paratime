import { EventBus } from 'eventbus-ts';

export class TickEvent extends EventBus.Event<string>{

  public getData():string{
    return this.data;
  }
}
