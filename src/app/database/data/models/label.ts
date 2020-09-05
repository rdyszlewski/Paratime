import { OrderableItem } from './orderable.item';
import { IFilterable } from 'app/shared/common/filter/filterable';

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
