import { Subtask } from 'app/database/shared/subtask/subtask';
import { OrderRepository } from '../task/order.respository';
import { DexieSubtaskDTO } from './local.subtask';

export type SubtaskDTO = DexieSubtaskDTO;

export class LocalSubtaskRepository extends OrderRepository<SubtaskDTO> {

  constructor(table: Dexie.Table<SubtaskDTO, number>){
    super(table, "taskId");
  }

  public findById(id: number): Promise<SubtaskDTO> {
    return this.table.get(id);
  }

  public findByTaskId(taskId: number): Promise<SubtaskDTO[]>{
    return this.table.where("taskId").equals(taskId).toArray();
  }

  public insert(subtask: SubtaskDTO): Promise<number>{
    return this.table.add(subtask);
  }

  public remove(id: number): Promise<void>{
    return this.table.delete(id);
  }

  public update(subtask: SubtaskDTO): Promise<number>{
    return this.table.update(subtask.id, subtask);
  }
}
