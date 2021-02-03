import { OrderableItem, Position } from 'app/database/shared/models/orderable.item';

export interface IOrderRepository<T extends OrderableItem>{
  // findById(id:number):Promise<T>;
  findBySuccessor(successorId:number):Promise<T>;
  findFirst(containerId: number):Promise<T>;
  findLast(containerId: number, exceptItem: number):Promise<T>;
  // update(item:T):Promise<number>;
}

export interface IRepository<T>{
  findById(id: number): Promise<T>;
  update(item: T): Promise<number>;
  // TODO: możliwe, że coś tutaj można dodać
}

export interface IOrderableRepository<T extends OrderableItem> extends IRepository<T>, IOrderRepository<T>{

}

export class OrderRepository<T extends OrderableItem> implements IOrderRepository<T>{

  protected table: Dexie.Table<T, number>;
  protected containerColumn: string;

  constructor(table:Dexie.Table<T, number>, containerColumn){
    this.table = table;
    this.containerColumn = containerColumn;
  }

  public findBySuccessor(successorId:number):Promise<T>{
    return this.table.where("successor").equals(successorId).first();
  }

  public findFirst(containerId: number): Promise<T>{
    if(containerId){
      return this.table.where({"position":Position.HEAD, [this.containerColumn]:containerId}).first();
    }
    return this.table.where({"position":Position.HEAD}).first();

  }

  public findLast(containerId: number, exceptItem: number = -1): Promise<T>{
    if(containerId){
      return this.table.where({"successor":-1, [this.containerColumn]: containerId,}).and(x=>x["_id"]!=exceptItem).first()
    }
    return this.table.where({"successor":-1}).and(x=>x["_id"]!=exceptItem).first();
  }
}
