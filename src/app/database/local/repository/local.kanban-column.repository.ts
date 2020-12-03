import { KanbanColumn } from 'app/database/data/models/kanban';
import { OrderRepository } from './order.respository';

export class LocalKanbanColumnRepository extends OrderRepository<KanbanColumn>{

  constructor(table: Dexie.Table<KanbanColumn, number>){
    super(table, "projectId");
  }

  public findById(id: number): Promise<KanbanColumn>{
    return this.table.get(id);
  }

  public findByProjectId(projectId: number): Promise<KanbanColumn[]>{
    return this.table.where("projectId").equals(projectId).toArray();
  }

  public findDefaultColumn(projectId: number): Promise<KanbanColumn>{
    return this.table.where({"projectId":projectId, "default":1}).first();
  }

  public insert(column:KanbanColumn):Promise<number>{
    return this.table.add(column);
  }

  public remove(column:KanbanColumn):Promise<void>{
    return this.table.delete(column.getId());
  }

  public update(column:KanbanColumn):Promise<number>{
    return this.table.update(column.getId(), column);
  }
}
