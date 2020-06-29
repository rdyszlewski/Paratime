import { ISubtaskRepository } from '../common/subtask_repository';
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

    public insertSubtask(subtask: Subtask): Promise<Subtask> {
        return this.table.add(subtask).then(insertedId=>{
            return this.table.get(insertedId);
        });
    }

    public updateSubtask(subtask: Subtask): Promise<Subtask> {
        return this.table.update(subtask.getId(), subtask).then(result=>{
            return Promise.resolve(subtask);
        });
    }

    public removeSubtask(id: number): Promise<void>{
        return this.table.delete(id);
    }
}