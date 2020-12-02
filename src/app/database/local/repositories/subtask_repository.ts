import { Subtask } from 'app/database/data/models/subtask';
import { LocalOrderRepository } from 'app/database/data/common/repositories/orderable.repository';
import { ISubtaskRepository } from 'app/database/data/common/repositories/subtask_repository';

export class LocalSubtaskRepository implements ISubtaskRepository{

    private table: Dexie.Table<Subtask, number>;
    private orderRepository: LocalOrderRepository<Subtask>;

    constructor(table: Dexie.Table<Subtask, number>){
        this.table = table;
        this.orderRepository = new LocalOrderRepository(table, "taskId");
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
