import { TaskItemOrderer } from './orderer';
import { OrderableItem } from 'app/database/shared/models/orderable.item';

export class OrderedList<T extends OrderableItem>{

    // private items: T[] = [];
    // private orderer: TaskItemOrderer<T> = new TaskItemOrderer();

    // public getItems():T[]{
    //     return this.items;
    // }

    // public addItem(item: T){
    //     // TODO: można zrobić wstawianie w odpowiednie miejsce
    //     this.items.push(item);
    // }

    // public removeItem(item: T){
    //   const index = this.items.findIndex(x=>x.getId() == item.getId());
    //   if(index >= 0){
    //       this.items.splice(index, 1);
    //   }
    // }

    // public setItems(items: T[]){
    //     this.items = this.orderer.getSortedItems(items);
    // }

    // public getFirstItem(){
    //     return this.items[0];
    // }

    // public getLastItem(){
    //     return this.items[this.items.length-1];
    // }

    // public updateItems(items:T[]){
    //   items.forEach(item=>{
    //     const index = this.items.findIndex(x=>x.getId()==item.getId());
    //     this.items[index] = item;
    //   })
    // }
}
