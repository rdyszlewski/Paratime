import { IOrderableList } from '../order/orderable.list';
import { IFilterableList } from '../filter/filterable.list';
import { Filter } from '../filter/filter';
import { IFilterable } from '../filter/filterable';
import { TaskItemOrderer } from '../order/orderer';
import { OrderableItem } from 'app/database/shared/models/orderable.item';

export class TasksList<T extends IFilterable & OrderableItem>
  implements IOrderableList, IFilterableList {
  private items: T[] = [];
  private itemFilter: Filter<T>;
  private orderer: TaskItemOrderer<T>;
  private containerId: number;

  constructor(containerId: number = null) {
    this.itemFilter = new Filter();
    this.orderer = new TaskItemOrderer();
    this.containerId = containerId;
  }

  public setItems(items: T[], order:boolean = true): void {
    this.items = items? items: [];
    this.refresh(order);
  }

  public setContainerId(containerId: number) {
    this.containerId = containerId;
  }

  public filter(value: string): void {
    this.itemFilter.filter(value, this.items);
  }

  public order() {
    this.items = this.orderer.getSortedItems(this.items);
  }

  public getItems() {
    return this.itemFilter.getFilteredItems();
  }

  public getAllItems(){
    return this.items;
  }

  public getItemByIndex(index: number): T {
    return this.getItems()[index];
  }

  public addItem(item: T, refresh: boolean = true): void {
    this.items.push(item);
    if (refresh) {
      this.refresh();
    }
  }

  private refresh(order: boolean=true) {
    if(order){
      this.order();
    }
    this.itemFilter.filter(null, this.items);
  }

  public updateItems(itemsToUpdate: T[]) {
    itemsToUpdate.forEach((item) => {
      const index = this.items.findIndex((x) => x.id == item.id);
      if (index >= 0) {
        const currentItem = this.items[index];
        // when the item is moved we remove it from container
        if (item.containerId != this.containerId) {
          this.removeItem(currentItem, false);
        } else {
          currentItem.containerId = item.containerId;
          currentItem.position = item.position;
          currentItem.successorId = item.successorId;
        }
      } else {
        // where the item does not exist and have correct containers id we add it to container
        if (item.containerId == this.containerId) {
          this.addItem(item, false);
        }
      }
    });
    this.refresh();
  }

  public removeItem(item: T, refresh: boolean = true) {
    const index = this.items.findIndex((x) => x.id == item.id);
    if (index >= 0) {
      this.items.splice(index, 1);
      if (refresh) {
        this.refresh();
      }
    }
  }

  public clear() {
    this.items = [];
    this.refresh();
  }
}
