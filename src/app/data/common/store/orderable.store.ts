import { OrderableItem } from 'app/data/models/orderable.item';

export interface IOrderableStore<T extends OrderableItem>{
  move(previousItem: T, currentItem: T, moveUp:boolean):Promise<T[]>;
  changeContainer(item: T, currentTask: T, currentContainerId: number): Promise<T[]>;
}
