import { KanbanTask } from 'app/database/data/models/kanban';
import { OrderRepository } from './order.respository';

export class LocalKanbanTaskRepository extends OrderRepository<KanbanTask>{

  constructor(table: Dexie.Table<KanbanTask, number>){
    super(table, "columnId");
  }

  public findById(id:number): Promise<KanbanTask>{
    return this.table.get(id);
  }

  public findByTask(taskId: number): Promise<KanbanTask>{
    return this.table.where("taskId").equals(taskId).first();
  }

  public findByColumn(columnId: number): Promise<KanbanTask[]>{
    return this.table.where("columnId").equals(columnId).toArray();
  }

  // TODO: czy szukanie ostatniego i pierwszego jest konieczne

  public insert(task: KanbanTask): Promise<number>{
    return this.table.add(task);
  }

  public remove(task: KanbanTask): Promise<void>{
    return this.table.delete(task.getId());
  }

  public removeAllFromColumn(columnId: number): Promise<number>{
    return this.table.where("columnId").equals(columnId).delete();
  }

  public removeByTask(taskId: number): Promise<number>{
    return this.table.where("taskId").equals(taskId).delete();
  }

  public update(task: KanbanTask): Promise<number>{
    return this.table.update(task.getId(), task);
  }

}
