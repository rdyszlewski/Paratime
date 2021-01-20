import { Label } from 'app/database/shared/label/label';
import { OrderRepository } from '../task/order.respository';


export class LocalLabelRepository extends OrderRepository<Label>{

  constructor(table: Dexie.Table<Label, number>){
    super(table, null);
  }

  public findById(id:number):Promise<Label>{
    return this.table.get(id);
  }

  public findByName(name:string):Promise<Label[]>{
    return this.table.where("name").startsWithIgnoreCase(name).toArray();
  }

  public findAll():Promise<Label[]>{
    return this.table.toArray();
  }

  public insert(label: Label): Promise<number>{
    return this.table.add(label);
  }

  public remove(label: Label): Promise<void>{
    return this.table.delete(label.id);
  }

  public update(label: Label): Promise<number>{
    return this.table.update(label.id, label);
  }

}
