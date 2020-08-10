import { OrderableItem } from 'app/models/orderable.item';

export interface IOrderableStore<T extends OrderableItem>{
  move(previousItem: T, currentItem: T):Promise<T[]>;
  changeContainer(item, currentTask: T, currentContainerId: number): Promise<T[]>;
  insert(item:T, beforeTask: T, containerId: number): Promise<T[]>;
  remove(item:T): Promise<T[]>; // TODO: tutaj nie jestem pewien
}
