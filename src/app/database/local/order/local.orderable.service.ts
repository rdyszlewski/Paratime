import { OrderableItem, Position } from 'app/database/shared/models/orderable.item';
import { OrderValues } from 'app/shared/common/values';
import { IOrderableRepository, IOrderRepository } from '../task/order.respository';

// TODO: refaktoryzacja
export class LocalOrderController<T extends OrderableItem> {

  constructor(private repository: IOrderableRepository<T>){

  }

  public move(currentItem: T, previousItem: T, currentIndex: number, previousIndex: number): Promise<T[]> {
    let moveUp = currentIndex < previousIndex;
    return this.remove(previousItem).then(updatedItems1=>{
      const updatedCurrentItem = updatedItems1.filter(x=>x.id==currentItem.id);
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
      beforeItemPromise = this.repository.findById(currentItem.successorId);
    }
    return beforeItemPromise.then(beforeItem=>{
      return this.insert(previousItem, beforeItem, previousItem.containerId);
    });
  }

  private joinItemsToUpdate(...items: Array<T[]>){
    const used = new Set<number>();
    const toUpdate = [];

    items.reverse().forEach(itemsToUpdate=>{
      itemsToUpdate.reverse().forEach(item=>{
        if(!used.has(item.id)){
          toUpdate.push(item);
          used.add(item.id);
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
    item.containerId = currentContainerId;
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
    const toUpdate = [];
    item.successorId = currentItem.id;
    return this.repository.findBySuccessor(currentItem.id).then(prevCurrent=>{
      if(prevCurrent){
        prevCurrent.successorId = item.id;
        item.position = Position.NORMAL;
        toUpdate.push(prevCurrent);
      }
      toUpdate.push(item);

      if(currentItem && currentItem.isHead()){
        currentItem.position = Position.NORMAL;
        item.position = Position.HEAD;
        toUpdate.push(currentItem);
      }
      return this.updateItems(toUpdate);
    });
  }

  public insertItemToEnd(item:T, containerId: number): Promise<T[]>{
    const toUpdate = [];
    return this.getLast(item, containerId).then(lastItem=>{
      if(lastItem){
        lastItem.successorId = item.id;
        item.position = Position.NORMAL;
        toUpdate.push(lastItem);
      } else { // first element
        item.position = Position.HEAD;
      }
      item.successorId = OrderValues.DEFAULT_ORDER;
      toUpdate.push(item);
      return this.updateItems(toUpdate);
    });
  }

  protected getLast(item: T, containerId: number): Promise<T>{
    return this.repository.findLast(containerId, item.id);
  }

  public remove(item: T): Promise<T[]> {
    const toUpdate = [];
    return this.repository.findBySuccessor(item.id).then(previousItem=>{
      if(!previousItem){
        let empty: T[] = []
        return Promise.resolve(empty);
      }
      if(item.isHead()){
        return this.removeHead(item, toUpdate);
      } else {
        return this.removeNotHead(previousItem, item, toUpdate);
      }
    });
  }

  private removeHead(item: T, toUpdate: any[]): T[] | PromiseLike<T[]> {
    return this.repository.findById(item.successorId).then(nextItem => {
      if (nextItem) {
        nextItem.position = Position.HEAD;
        toUpdate.push(nextItem);
      }
      return this.updateItems(toUpdate);
    });
  }

  private removeNotHead(previousItem: T, item: T, toUpdate: any[]) {
    previousItem.successorId = item.successorId;
    toUpdate.push(previousItem);
    return this.updateItems(toUpdate);
  }
}
