import { IOrderable } from './order';

export class TaskItemOrderer <T extends IOrderable>{

    public getSortedItems(items:T[]){
        if(items.length == 0){
            return [];
        }
        return this.order(items);
    }

    private order(items: T[]) {
        const result = [];
        let currentItem = this.findFirstItem(items);
        console.log("Teraz tutaj");
        console.log(currentItem);
        while (currentItem != null) {
            console.log("Jestem tutaj");
            result.push(currentItem);
            currentItem = this.findItemByPrev(currentItem.getId(), items);
        }
        return result;
    }

    private findFirstItem(items: T[]){
        return items.find(item=>item.getPrevId() == -1);
    }

    private findItemByPrev(prevId:number, items:T[]){
        return items.find(item=>item.getPrevId() == prevId);
    }
}
