import { OrderableItem } from "app/database/shared/models/orderable.item";
import { LocalDTO } from "./local.dto";
import { IOrderRepository, OrderRepository } from "./order.respository";

export class OrderDTORepository<T extends OrderableItem,K extends LocalDTO<T>> implements IOrderRepository<T>{

  private orderRepository: IOrderRepository<K>;
  private  _table: Dexie.Table<K, number>;

  public get table():Dexie.Table<K, number>{
    return this._table;
  }

  constructor(table: Dexie.Table<K, number>, containerColumn){
    this.orderRepository = new OrderRepository(table, containerColumn);
    this._table = table;
  }

  public findBySuccessor(successorId: number): Promise<T> {
    return this.orderRepository.findBySuccessor(successorId).then(result=>{
      // TODO: co dalej z tym zrobić
      return Promise.resolve(result.getModel());
    });
  }

  public findFirst(containerId: number): Promise<T> {
    return this.orderRepository.findFirst(containerId).then(result=>{
      return Promise.resolve(result.getModel());
    })
  }

  public findLast(containerId: number, exceptItem: number): Promise<T> {
    return this.orderRepository.findLast(containerId, exceptItem).then(result=>{
      return Promise.resolve(result.getModel());
    });
  }

  // TODO: sprawdzić, czy to będzie działało poprawnie
}
