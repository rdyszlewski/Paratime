import { IOrderable } from './order';
import { TaskItemOrderer } from './orderer';

export class OrderedList<T extends IOrderable>{

    private items: T[] = [];
    private orderer: TaskItemOrderer<T> = new TaskItemOrderer();

    public getItems():T[]{
        return this.items;
    }

    public addItem(item: T){
        // TODO: można zrobić wstawianie w odpowiednie miejsce
        this.items.push(item);
    }

    public removeItem(item: T){
        const index = this.items.indexOf(item);
        if(index >= 0){
            this.items = this.items.splice(index, 1);
        }
    }

    public setItems(items: T[]){
      console.log("Jeden");
      console.log(items);
        this.items = this.orderer.getSortedItems(items);
        console.log(this.items);
    }

    public getFirstItem(){
        return this.items[0];
    }

    public getLastItem(){
        return this.items[this.items.length-1];
    }

    public getItemByPrev(prevId: number){
        return this.items.find(item=>item.getPrevId() == prevId);
    }

    public getItemByNext(nextId:number){
        return this.items.find(item=>item.getNextId() == nextId);
    }
}
