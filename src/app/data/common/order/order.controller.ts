import { OrderableItem, Position } from 'app/models/orderable.item';
import { IOrderableRepository } from '../repositories/orderable.repository';
import { OrderValues } from 'app/common/valuse';

export class StoreOrderController<T extends OrderableItem> {

  private repository: IOrderableRepository<T>;

  constructor(repository: IOrderableRepository<T>){
    this.repository = repository;
  }

  public move(previousItem: T, currentItem: T, moveUp:boolean): Promise<T[]> {
    return this.remove(previousItem).then(updatedItems1=>{
      const updatedCurrentItem = updatedItems1.filter(x=>x.getId()==currentItem.getId());
      let newCurrentItem = updatedCurrentItem.length>0? updatedCurrentItem[0]: currentItem;
      return this.insertItemToList(previousItem, newCurrentItem, moveUp).then(updatedItems2=>{
        const result = this.joinItemsToUpdate(updatedItems1, updatedItems2);
        return Promise.resolve(result);
      });
    });
  }

  private insertItemToList(previousItem: T, currentItem: T, moveUp:boolean){
    let beforeItemPromise:Promise<T>;
    if(moveUp){
      beforeItemPromise = Promise.resolve(currentItem);
    } else {
      beforeItemPromise = this.repository.findById(currentItem.getSuccessorId());
    }
    return beforeItemPromise.then(beforeItem=>{
      return this.insert(previousItem, beforeItem, previousItem.getContainerId());
    });
  }

  private joinItemsToUpdate(...items: Array<T[]>){
    const used = new Set<number>();
    const toUpdate = [];

    items.reverse().forEach(itemsToUpdate=>{
      itemsToUpdate.reverse().forEach(item=>{
        if(!used.has(item.getId())){
          toUpdate.push(item);
          used.add(item.getId());
        }
      });
    });
    return toUpdate;
  }

  private updateItems(items:T[]):Promise<T[]>{
    const promises: Promise<number>[] = items.map(item => this.repository.update(item))
    return Promise.all(promises).then(()=>{
      return Promise.resolve(items);
    });
  }

  public changeContainer(item: T, currentItem: T, currentContainerId: number): Promise<T[]> {
    item.setContainerId(currentContainerId);
    return this.remove(item).then(updatedTasks1=>{
      return this.insert(item, currentItem, currentContainerId).then(updatedTasks2=>{
        return this.updateItems([item]).then(updatedTasks3=>{
          const toUpdate = this.joinItemsToUpdate(updatedTasks1, updatedTasks2, updatedTasks3);
          return Promise.resolve(toUpdate);
        })
      })
    })
  }

  public insert(item: T, currentItem: T, currentContainerId: number): Promise<T[]> {
    return currentItem?
      this.insertItemBefore(item, currentItem):
      this.insertItemToEnd(item, currentContainerId);
  }

  private insertItemBefore(item: T, currentItem: T):Promise<T[]>{
    // TODO: refaktoryzacja
    const toUpdate = [];
    item.setSuccessorId(currentItem.getId());
    return this.repository.findBySuccessor(currentItem.getId()).then(prevCurrent=>{
      if(prevCurrent){
        prevCurrent.setSuccessorId(item.getId());
        item.setPosition(Position.NORMAL);
        toUpdate.push(prevCurrent);
      }
      toUpdate.push(item);

      if(currentItem && currentItem.isHead()){
        currentItem.setPosition(Position.NORMAL);
        item.setPosition(Position.HEAD);
        toUpdate.push(currentItem);
      }
      return this.updateItems(toUpdate);
    });
  }

  public insertItemToEnd(item:T, containerId: number): Promise<T[]>{
    const toUpdate = [];
    // TODO: tutaj jest błąd, który powoduje
    return this.getLast(item, containerId).then(lastItem=>{
      console.log("ostatni element");
      console.log(lastItem);
      if(lastItem){
        lastItem.setSuccessorId(item.getId());
        item.setPosition(Position.NORMAL);
        toUpdate.push(lastItem);
      } else { // first element
        item.setPosition(Position.HEAD);
      }
      item.setSuccessorId(OrderValues.DEFAULT_ORDER);
      toUpdate.push(item);
      console.log(toUpdate);
      return this.updateItems(toUpdate);
    });
  }

  protected getLast(item: T, containerId: number): Promise<T>{
    console.log("Wykonywanie tego starego");
    console.log(item);
    return this.repository.findLast(containerId, item.getId());
  }

  public remove(item: T): Promise<T[]> {
    const toUpdate = [];
    return this.repository.findBySuccessor(item.getId()).then(previousItem=>{
      if(item.isHead()){
        return this.removeHead(item, toUpdate);
      } else {
        return this.removeNotHead(previousItem, item, toUpdate);
      }
    });
  }

  private removeHead(item: T, toUpdate: any[]): T[] | PromiseLike<T[]> {
    return this.repository.findById(item.getSuccessorId()).then(nextItem => {
      if (nextItem) {
        nextItem.setPosition(Position.HEAD);
        toUpdate.push(nextItem);
      }
      return this.updateItems(toUpdate);
    });
  }

  private removeNotHead(previousItem: T, item: T, toUpdate: any[]) {
    previousItem.setSuccessorId(item.getSuccessorId());
    toUpdate.push(previousItem);
    return this.updateItems(toUpdate);
  }
}
