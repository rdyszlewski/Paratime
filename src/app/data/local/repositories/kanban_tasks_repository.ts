import { IKanbanTasksRepository } from 'app/data/common/repositories/kanban_tasks_repository';
import { KanbanTask } from 'app/data/models/kanban';
import { OrderRepository } from 'app/data/common/repositories/orderable.repository';

export class LocalKanbanTasksRepository implements IKanbanTasksRepository{

    private table: Dexie.Table<KanbanTask, number>;
    private orderRepository: OrderRepository<KanbanTask>;

    constructor(table: Dexie.Table<KanbanTask, number>){
        this.table = table;
        this.orderRepository = new OrderRepository(table, "columnId");
    }

    public findById(id: number): Promise<KanbanTask>{
        return this.table.get(id);
    }

    public findTasksByTaskId(taskId: number): Promise<KanbanTask> {
        return this.table.where("taskId").equals(taskId).first();
    }

    public findTasksByColumn(columnId: number): Promise<KanbanTask[]> {
        return this.table.where("columnId").equals(columnId).toArray();
    }

    public findLast(columnId: number, exceptItem:number): Promise<KanbanTask> {
        return this.orderRepository.findLast(columnId, exceptItem);
    }

    public findFirst(columnId: number): Promise<KanbanTask> {
      return this.orderRepository.findFirst(columnId);
    }

    public findBySuccessor(successorId: number):Promise<KanbanTask>{
      return this.orderRepository.findBySuccessor(successorId);
    }

    public insertTask(task: KanbanTask): Promise<number> {
        return this.table.add(task);
    }

    public update(task: KanbanTask): Promise<number> {
        return this.table.update(task.getId(), task);
    }

    public removeTask(taskId: any): Promise<void> {
        return this.table.delete(taskId);
    }

    public removeTasksByColumn(columnId: number): Promise<void> {
        return this.findTasksByColumn(columnId).then(results=>{
            return results.forEach(column=>{
                this.table.delete(column.getId());
            });
        });
    }
}
