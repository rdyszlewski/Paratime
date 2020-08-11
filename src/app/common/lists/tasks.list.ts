import { IOrderableList } from '../order/orderable.list';
import { IFilterableList } from '../filter/filterable.list';
import { Filter } from '../filter/filter';
import { IFilterable } from '../filter/filterable';
import { TaskItemOrderer } from '../order/orderer';
import { OrderableItem } from 'app/models/orderable.item';
import { ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';

export class TasksList<T extends IFilterable & OrderableItem > implements IOrderableList, IFilterableList{

  private items: T[];
  private itemFilter: Filter<T>;
  private orderer: TaskItemOrderer<T>;

  constructor(){
    this.itemFilter = new Filter();
    this.orderer = new TaskItemOrderer();
  }

  public setItems(items:T[]): void{
    console.log("setItems");
    console.log(items);
    this.items = items;
    this.order();
    this.refresh();
  }

  public filter(value: string): void {
    this.itemFilter.filter(value, this.items);
  }

  public order() {
    this.items = this.orderer.getSortedItems(this.items);
  }

  public getItems(){
    return this.itemFilter.getFilteredItems();
  }

  public getItemByIndex(index: number): T{
    return this.getItems()[index];
  }

  public addItem(item:T):void{
    this.items.push(item);
    this.refresh();
  }

  private refresh(){
    console.log("Odświeżanie");
    this.order();
    this.itemFilter.filter(null, this.items);
  }

  public updateItems(itemsToUpdate: T[]){
    console.log("Aktualizacja");
    itemsToUpdate.forEach(item=>{
      const index = this.items.findIndex(x=>x.getId()==item.getId());
      if(index>=0){
        // const currentItem = this.items[index];
        // currentItem.setContainerId(item.getContainerId());
        // currentItem.setPosition(item.getPosition());
        // currentItem.setSuccessorId(item.getSuccessorId());
        this.items[index] = item;
      }
    });
    this.refresh();
  }

  public removeItem(item: T){
    const index = this.items.findIndex(x=>x.getId() == item.getId());
      if(index >= 0){
          this.items.splice(index, 1);
      }
  }

}
