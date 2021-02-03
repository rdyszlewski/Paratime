import { OrderRepository } from '../task/order.respository';
import { DexieLabelDTO } from './local.label';

export type LabelDTO = DexieLabelDTO;

export class LocalLabelRepository extends OrderRepository<LabelDTO> {

  constructor(table: Dexie.Table<LabelDTO, number>){
    super(table, null);
  }

  public findById(id:number):Promise<LabelDTO>{
    return this.table.get(id);
  }

  public findByName(name:string):Promise<LabelDTO[]>{
    return this.table.where("name").startsWithIgnoreCase(name).toArray();
  }

  public findAll():Promise<LabelDTO[]>{
    return this.table.toArray();
  }

  public insert(label: LabelDTO): Promise<number>{
    return this.table.add(label);
  }

  public remove(id: number): Promise<void>{
    return this.table.delete(id);
  }

  public update(label: LabelDTO): Promise<number>{
    return this.table.update(label.id, label);
  }

}
