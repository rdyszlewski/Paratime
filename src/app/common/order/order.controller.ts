import { OrderableItem, Position } from 'app/models/orderable.item';
import { OrderValues } from '../valuse';

export class OrderController<T extends OrderableItem>{

    public move(previousIndex: number, currentIndex: number, items:T[]):T[]{
        const toUpdate = [];

        const firstItem = items[Math.min(previousIndex, currentIndex)];
        const secondItem = items[Math.max(previousIndex, currentIndex)];
        const prevFirst = this.findItemBySuccessor(firstItem.getId(), items);
        const prevSecond = this.findItemBySuccessor(secondItem.getId(), items);

        if(prevFirst){
          prevFirst.setSuccessorId(secondItem.getId());
          toUpdate.push(prevFirst);
        }
        if(prevSecond){
          prevSecond.setSuccessorId(secondItem.getSuccessorId());
          toUpdate.push(prevSecond);
        }
        secondItem.setSuccessorId(firstItem.getId());
        toUpdate.push(secondItem);
        return toUpdate;
    }

    private findItemBySuccessor(successorId, items:T[]):T{
      return items.find(x=>x.getSuccessorId()==successorId);
    }

    private findItemById(id:number, items:T[]):T{
        return items.find(item=>item.getId()==id);
    }

    public removeItem(item:T, items: T[]):T[]{
        const toUpdate = [];
        const previousItem = this.findItemBySuccessor(item.getId(), items);
        if(previousItem){
          previousItem.setSuccessorId(item.getSuccessorId());
          toUpdate.push(previousItem);
        }

        if(item.isHead()){
          const nextItem = this.findItemById(item.getSuccessorId(), items);
          if(nextItem){
            nextItem.setPosition(Position.HEAD);
            toUpdate.push(nextItem);
          }
        }

        return toUpdate;
    }

    // TODO: dokładnie sprawdzić tę metodę
    public insertItem(item: T, position:number, items:T[]):T[]{
        const toUpdate = [];
        // TODO: to będzie trzeba przenieść w inne miejsce
        // this.changeKanbanColumn(item);
        toUpdate.push(item);
        if(items.length == 0){
          item.setPosition(Position.HEAD);
          item.setSuccessorId(OrderValues.DEFAULT_ORDER);
          return toUpdate;
        }
        const currentItem = items[position];
        if(currentItem){
            const itemsToUpdate = this.insertItemBefore(currentItem, item, items);
            toUpdate.concat(itemsToUpdate);
        } else {
            const itemsToUpdate = this.insertItemToEnd(item, items);
            toUpdate.concat(itemsToUpdate);
        }
        return toUpdate;
    }

    // TODO: sprawdzić, czy to będzie przydatne
    public insertItemToEnd(item:T, items:T[]){
        // TODO: tutaj chyba będzie trzeba dodać zaktualizowane
        const toUpdate = [];
        const lastItem = this.findLastItem(items);
        if(lastItem){
          lastItem.setSuccessorId(item.getId());
          toUpdate.push(lastItem);
        }
        return toUpdate;
    }

    private findLastItem(items:T[]):T{
      return items.find(x=>x.getSuccessorId()==-1);
    }

    public insertItemBefore(currentItem: T, item: T, items:T[]):T[]{
        const toUpdate = [];

        item.setSuccessorId(currentItem.getId());
        const previousItem = this.findItemBySuccessor(currentItem.getId(), items);
        if(previousItem){
          previousItem.setSuccessorId(item.getId());
          toUpdate.push(previousItem);
        }

        return toUpdate;
    }

}
