import { OrderableItem, Position } from 'app/models/orderable.item';

export interface IOrderableRepository<T extends OrderableItem>{
  findById(id:number):Promise<T>;
  findBySuccessor(successorId:number):Promise<T>;
  findFirst(containerId: number):Promise<T>;
  findLast(containerId: number, exceptItem: number):Promise<T>;
  update(item:T):Promise<number>;
}

export class OrderRepository<T extends OrderableItem>{

  private table: Dexie.Table<T, number>;
  private containerColumn: string;

  constructor(table:Dexie.Table<T, number>, containerColumn){
    this.table = table;
    this.containerColumn = containerColumn;
  }

  public findBySuccessor(successorId:number):Promise<T>{
    return this.table.where("successor").equals(successorId).first();
  }

  public findFirst(containerId: number): Promise<T>{
    return this.table.where({"position":Position.HEAD, [this.containerColumn]:containerId}).first();
  }

  public findLast(containerId: number, exceptItem: number = -1): Promise<T>{
    return this.table.where({"successor":-1, [this.containerColumn]: containerId,}).and(x=>x["id"]!=exceptItem).first()
  }
}
