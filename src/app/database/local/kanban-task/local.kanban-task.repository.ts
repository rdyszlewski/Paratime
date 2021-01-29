import { KanbanTask } from 'app/database/shared/kanban-task/kanban-task';
import { OrderRepository } from '../task/order.respository';
import { DexieKanbanTaskDTO } from './local.kanban-task';

export type KanbanTaskDTO = DexieKanbanTaskDTO

export class LocalKanbanTaskRepository extends OrderRepository<KanbanTaskDTO> {

  constructor(table: Dexie.Table<KanbanTaskDTO, number>){
    super(table, "columnId");
  }

  public findById(id:number): Promise<KanbanTaskDTO>{
    return this.table.get(id);
  }

  public findByTask(taskId: number): Promise<KanbanTaskDTO>{
    return this.table.where("taskId").equals(taskId).first();
  }

  public findByColumn(columnId: number): Promise<KanbanTaskDTO[]>{
    return this.table.where("columnId").equals(columnId).toArray();
  }

  // TODO: czy szukanie ostatniego i pierwszego jest konieczne

  public insert(task: KanbanTaskDTO): Promise<number>{
    return this.table.add(task);
  }

  public remove(id: number): Promise<void>{
    return this.table.delete(id);
  }

  public removeAllFromColumn(columnId: number): Promise<number>{
    return this.table.where("columnId").equals(columnId).delete();
  }

  public removeByTask(taskId: number): Promise<number>{
    return this.table.where("taskId").equals(taskId).delete();
  }

  public update(task: KanbanTaskDTO): Promise<number>{
    return this.table.update(task.id, task);
  }
}
