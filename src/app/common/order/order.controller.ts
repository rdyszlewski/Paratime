import { OrderableItem, Position } from 'app/models/orderable.item';

export class OrderController<T extends OrderableItem>{

    public move(previousIndex: number, currentIndex: number, items:T[]):T[]{
      // TODO: refaktoryzacja
        const toUpdate = [];

        const previousItem = items[previousIndex];
        const currentItem = items[currentIndex];
        const prevPreviousItem = this.findItemBySuccessor(previousItem.getId(), items);
        const prevCurrentItem = this.findItemBySuccessor(currentItem.getId(), items);

        const tempSuccessor = previousItem.getSuccessorId();
        if(currentItem.getSuccessorId() != previousItem.getId()){
          previousItem.setSuccessorId(currentItem.getSuccessorId());
        } else {
          previousItem.setSuccessorId(currentItem.getId());
        }
        if(tempSuccessor != currentItem.getId()){
          currentItem.setSuccessorId(tempSuccessor);
        } else {
          currentItem.setSuccessorId(previousItem.getId());
        }

        const tempPosition = currentItem.getPosition();
        currentItem.setPosition(previousItem.getPosition());
        previousItem.setPosition(tempPosition);

        toUpdate.push(previousItem);
        toUpdate.push(currentItem);

        if(prevPreviousItem && prevPreviousItem.getId() != currentItem.getId()){
          prevPreviousItem.setSuccessorId(currentItem.getId());
          toUpdate.push(prevPreviousItem);
        }
        if(prevCurrentItem && prevCurrentItem.getId() != previousItem.getId()){
          prevCurrentItem.setSuccessorId(previousItem.getId());
          toUpdate.push(prevCurrentItem);
        }

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
