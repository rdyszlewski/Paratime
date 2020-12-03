import { Subtask } from 'app/database/data/models/subtask';
import { OrderRepository } from './order.respository';

export class LocalSubtaskRepository extends OrderRepository<Subtask>{

  constructor(table: Dexie.Table<Subtask, number>){
    super(table, "taskId");
  }

  public findById(id: number): Promise<Subtask>{
    return this.table.get(id);
  }

  public findByTaskId(taskId: number): Promise<Subtask[]>{
    return this.table.where("taskId").equals(taskId).toArray();
  }

  public insert(subtask: Subtask): Promise<number>{
    return this.table.add(subtask);
  }

  public remove(subtask: Subtask): Promise<void>{
    return this.table.delete(subtask.getId());
  }

  public update(subtask: Subtask): Promise<number>{
    return this.table.update(subtask.getId(), subtask);
  }
}
