import { OrderableItem, Position } from 'app/models/orderable.item';
import { IOrderableRepository } from '../repositories/orderable.repository';


export class StoreOrderController<T extends OrderableItem> {

  private repository: IOrderableRepository<T>;

  constructor(repository: IOrderableRepository<T>){
    this.repository = repository;
  }

  public move(previousItem: T, currentItem: T): Promise<T[]> {
    const isPrevSuccessorCurrent = previousItem.getSuccessorId() == currentItem.getId();
    const firstItem = isPrevSuccessorCurrent? previousItem : currentItem;
    const secondItem = isPrevSuccessorCurrent? currentItem: previousItem;

    return this.getPreviousItems(firstItem, secondItem).then(previousItems=>{
      const prevFirst = previousItems[0];
      const prevSecond = previousItems[1];

      const secondItemSuccessor = secondItem.getSuccessorId();
      secondItem.setSuccessorId(firstItem.getId());
      secondItem.setPosition(firstItem.getPosition());

      const toUpdate = [];
      toUpdate.push(secondItem);

      if(firstItem != prevSecond){
        firstItem.setPosition(Position.NORMAL);
        toUpdate.push(firstItem);
      } else {
        prevSecond.setPosition(Position.NORMAL);
      }

      if(prevFirst){
        prevFirst.setSuccessorId(secondItem.getId());
        toUpdate.push(prevFirst);
      }

      if(prevSecond){
        prevSecond.setSuccessorId(secondItemSuccessor);
        toUpdate.push(prevSecond);
      }

      return this.updateItems(toUpdate);
    })
  }

  private updateItems(items:T[]):Promise<T[]>{
    const promises: Promise<number>[] = items.map(item => this.repository.update(item))
    return Promise.all(promises).then(()=>{
      return Promise.resolve(items);
    });
  }

  private getPreviousItems(firstItem: T, secondItem: T):Promise<T[]>{
    const promises = [];
    promises.push(this.repository.findBySuccessor(firstItem.getId()));
    promises.push(this.repository.findBySuccessor(secondItem.getId()));
    return Promise.all(promises);
  }


  public changeContainer(item: T, currentItem: T, currentContainerId: number): Promise<T[]> {
    item.setContainerId(currentContainerId);

    const promises = [
      this.remove(item),
      this.insert(item, currentItem, currentContainerId),
      this.updateItems([item])
    ]

    return Promise.all(promises).then(results=>{
      const updatedItems = [];
      updatedItems.push.apply(updatedItems, results[0]);
      updatedItems.push.apply(updatedItems, results[1]);
      updatedItems.push.apply(updatedItems, results[2]);
      return Promise.resolve(updatedItems);
    });
  }

  public insert(item: T, currentItem: T, currentContainerId: number): Promise<T[]> {
    const toUpdatePromise = currentItem?
      this.insertItemBefore(item, currentItem):
      this.insertItemToEnd(item, currentContainerId);
    return toUpdatePromise.then(items=>{
      return this.updateItems(items);
    });
  }

  private insertItemBefore(item: T, currentItem: T):Promise<T[]>{
    const toUpdate = [];
    item.setSuccessorId(currentItem.getId());
    return this.repository.findBySuccessor(currentItem.getId()).then(prevCurrent=>{
      if(prevCurrent){
        prevCurrent.setSuccessorId(item.getId());
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
    return this.repository.findLast(containerId, item.getId()).then(lastItem=>{
      if(lastItem){
        lastItem.setSuccessorId(item.getId());
        toUpdate.push(lastItem);
      } else {
        item.setPosition(Position.HEAD);
        toUpdate.push(item);
      }
      return Promise.resolve(toUpdate);
    });
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
