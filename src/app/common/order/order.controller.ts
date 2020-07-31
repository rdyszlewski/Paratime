import { IOrderable } from './order';
import { OrderValues } from '../valuse';

export class OrderController<T extends IOrderable>{

    // TODO: pytanie, czcy to będzie poprawne 
    public move(previousIndex: number, currentIndex: number, items:T[]):T[]{
        // TODO: zastanowić się, czy potrzeba 
        const toUpdate:T[] = [];

        const previousTask = items[previousIndex];
        const currentTask = items[currentIndex];
       
        const prevPrev = this.findItemById(previousTask.getPrevId(), items);
        const prevNext = this.findItemById(previousTask.getNextId(), items);
        const currPrev = this.findItemById(currentTask.getPrevId(), items);
        const currNext = this.findItemById(currentTask.getNextId(), items);
  
        if(prevPrev){
            prevPrev.setNextId(currentTask.getId());
            toUpdate.push(prevPrev);
        }
        if(prevNext ){
            prevNext.setPrevId(currentTask.getId());
            toUpdate.push(prevNext);
        }
        if(currPrev ){
            currPrev.setNextId(previousTask.getId());
            toUpdate.push(currPrev);
        }
        if(currNext){
            currNext.setPrevId(previousTask.getId());
            toUpdate.push(currNext);
        }
        
        const tempPrevious = previousTask.getPrevId();
        const tempNext = previousTask.getNextId();
        previousTask.setPrevId(currentTask.getPrevId());
        previousTask.setNextId(currentTask.getNextId());
        currentTask.setPrevId(tempPrevious);
        currentTask.setNextId(tempNext);

        toUpdate.push(previousTask);
        toUpdate.push(currentTask);

        return toUpdate;
    }

    private findItemById(id:number, items:T[]):T{
        return items.find(item=>item.getId()==id);
    }

    public removeItem(item:T, items: T[]):T[]{
        const toUpdate = [];
        const previousTask = this.findItemById(item.getPrevId(), items);
        const nextTask = this.findItemById(item.getNextId(), items);
        if(previousTask){
            previousTask.setNextId(nextTask?nextTask.getId(): -1);
            toUpdate.push(previousTask);
        }
        if(nextTask){
            nextTask.setPrevId(previousTask?previousTask.getId(): -1);
            toUpdate.push(nextTask);
        }

        return toUpdate;
    }

    public insertItem(item: T, position:number, items:T[]):T[]{
        const toUpdate = [];
        // TODO: to będzie trzeba przenieść w inne miejsce
        // this.changeKanbanColumn(item);
        toUpdate.push(item);
        if(items.length == 0){
            this.setItemFirst(item, items);
            return toUpdate;
        }
        const currentTask = items[position];
        if(currentTask){
            this.insertItemBefore(currentTask, item, items);
        } else {
            this.insertItemToEnd(item, items);
        }
        return toUpdate;
    }

    private setItemFirst(item: T, items:T[]) {
        item.setPrevId(OrderValues.DEFAULT_ORDER);
        item.setPrevId(OrderValues.DEFAULT_ORDER);
    }

    // TODO: sprawdzić, czy to będzie przydatne
    public insertItemToEnd(item:T, items:T[]){
        // TODO: tutaj chyba będzie trzeba dodać zaktualizowane
        const lastElement = items[items.length - 1];
        lastElement.setNextId(item.getId());
        item.setPrevId(lastElement.getId());
        item.setNextId(-1);
    }

    public insertItemBefore(currentItem: T, item: T, items:T[]):T[]{
        const toUpdate = [];

        const previousTask = this.findItemById(currentItem.getPrevId(), items);

        item.setPrevId(currentItem.getPrevId());
        item.setNextId(currentItem.getId());
        currentItem.setPrevId(item.getId());

        toUpdate.push(currentItem);
        if (previousTask) {
            previousTask.setNextId(item.getId());
            toUpdate.push(previousTask);
        }
        return toUpdate;
    }

}