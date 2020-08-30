import { ISubtaskRepository } from '../../common/repositories/subtask_repository';
import { Subtask } from 'app/data/models/subtask';
import { OrderRepository } from 'app/data/common/repositories/orderable.repository';

export class LocalSubtaskRepository implements ISubtaskRepository{

    private table: Dexie.Table<Subtask, number>;
    private orderRepository: OrderRepository<Subtask>;

    constructor(table: Dexie.Table<Subtask, number>){
        this.table = table;
        this.orderRepository = new OrderRepository(table, "taskId");
    }

    public findById(id: number): Promise<Subtask> {
        return this.table.where('id').equals(id).first();
    }

    public findByTask(taskId: number): Promise<Subtask[]> {
        return this.table.where('taskId').equals(taskId).toArray();
    }

    public insert(subtask: Subtask): Promise<number> {
        return this.table.add(subtask);
    }

    public update(subtask: Subtask): Promise<number> {
        return this.table.update(subtask.getId(), subtask);
    }

    public remove(id: number): Promise<void>{
        return this.table.delete(id);
    }

    public bulkRemove(ids:number[]):Promise<void>{
        return this.table.bulkDelete(ids);
    }

    public findBySuccessor(successorId: number): Promise<Subtask> {
      return this.orderRepository.findBySuccessor(successorId);
    }

    public findFirst(containerId: number): Promise<Subtask> {
      return this.orderRepository.findFirst(containerId);
    }

    public findLast(containerId: number, exceptItem: number): Promise<Subtask> {
      return this.orderRepository.findLast(containerId, exceptItem);
    }

}
