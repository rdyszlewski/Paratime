import { IKanbanColumnsRepository } from 'app/data/common/repositories/kanban_columns_repository';
import { KanbanColumn } from 'app/models/kanban';
import { OrderRepository } from 'app/data/common/repositories/orderable.repository';

export class LocalKanbanColumnsRepository implements IKanbanColumnsRepository{

    private table: Dexie.Table<KanbanColumn, number>;
    private orderRepository: OrderRepository<KanbanColumn>;

    constructor(table: Dexie.Table<KanbanColumn, number>){
        this.table = table;
        this.orderRepository = new OrderRepository(table, "projectId");
    }

    public findById(id: number): Promise<KanbanColumn> {
        return this.table.get(id);
    }

    public findByProject(projectId: number): Promise<KanbanColumn[]> {
        return this.table.where("projectId").equals(projectId).toArray();
    }

    public findDefaultColumn(projectId: number): Promise<KanbanColumn> {
        return this.table.where({"projectId": projectId, "default": 1}).first();
    }

    public insert(column: KanbanColumn): Promise<number> {
        return this.table.add(column);
    }

    public update(column: KanbanColumn): Promise<number> {
        return this.table.update(column.getId(), column);
    }

    public remove(columnId: number): Promise<void> {
        return this.table.delete(columnId);
    }

    public removeByProject(projectId: number): Promise<void> {
        // TODO: sprawdzić, czy to działa
        return this.findByProject(projectId).then(results=>{
            return results.forEach(column=>{
                this.table.delete(column.getId());
            })
        });
    }

    public findBySuccessor(successorId: number): Promise<KanbanColumn> {
      return this.orderRepository.findBySuccessor(successorId);
    }

    public findFirst(containerId: number): Promise<KanbanColumn> {
      return this.orderRepository.findFirst(containerId);
    }

    public findLast(containerId: number, exceptItem: number): Promise<KanbanColumn> {
      return this.orderRepository.findLast(containerId, exceptItem);
    }
}
