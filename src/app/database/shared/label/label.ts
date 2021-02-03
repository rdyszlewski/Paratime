import { OrderableItem } from '../models/orderable.item';
import { IFilterable } from 'app/shared/common/filter/filterable';

export class Label extends OrderableItem implements IFilterable {

  private _name: string = null;

  constructor(name = null) {
    super();
    this._name = name;
  }

  public get name() {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get containerId(): number {
    return null;
  }
  public set containerId(id: number) {
    return;
  }
}
