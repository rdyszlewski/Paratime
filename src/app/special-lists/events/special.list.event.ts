import { EventBus } from 'eventbus-ts';
import { SpecialList } from 'app/projects/common/special_list';

export class SpecialListEvent extends EventBus.Event<SpecialList>{

  public getData():SpecialList{
    return this.data;
  }
}
