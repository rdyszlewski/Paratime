import { ISubtaskRepository } from '../../common/repositories/subtask_repository';
import { Subtask } from 'app/models/subtask';

export class LocalSubtaskRepository implements ISubtaskRepository{

    private table: Dexie.Table<Subtask, number>;

    constructor(table: Dexie.Table<Subtask, number>){
        this.table = table;
    }

    public findSubtaskById(id: number): Promise<Subtask> {
        return this.table.where('id').equals(id).first();
    }

    public findSubtasksByTask(taskId: number): Promise<Subtask[]> {
        return this.table.where('taskId').equals(taskId).toArray();
    }

    public insertSubtask(subtask: Subtask): Promise<number> {
        return this.table.add(subtask);
    }

    public updateSubtask(subtask: Subtask): Promise<number> {
        return this.table.update(subtask.getId(), subtask);
    }

    public removeSubtask(id: number): Promise<void>{
        return this.table.delete(id);
    }

    public bulkRemoveSubtasks(ids:number[]):Promise<void>{
        return this.table.bulkDelete(ids);
    }
}