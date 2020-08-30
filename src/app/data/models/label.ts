import { IFilterable } from 'app/common/filter/filterable';
import { OrderableItem } from './orderable.item';

export class Label extends OrderableItem implements IFilterable {
  private name: string = null;

  constructor(name = null) {
    super();
    this.name = name;
  }

  public getName() {
    return this.name;
  }

  public setName(name: string) {
    this.name = name;
  }

  public getContainerId(): number {
    return null;
  }
  public setContainerId(id: number): void {
    return;
  }
}
