import { ITaskLabelsRepository } from '../../common/repositories/task_labels_repository';
import { TaskLabelsModel } from '../../common/models';

export class LocalTaskLabelsRepository implements ITaskLabelsRepository{

    private table: Dexie.Table<TaskLabelsModel, number>;

    constructor(table: Dexie.Table<TaskLabelsModel, number>){
        this.table = table;
    }

    public findByTaskId(taskId: number): Promise<TaskLabelsModel[]> {
        return this.table.where('taskId').equals(taskId).toArray();
    }

    public findByLabelId(labelId: number): Promise<TaskLabelsModel[]> {
        return this.table.where('labelId').equals(labelId).toArray();
    }

    public insert(entry: TaskLabelsModel): Promise<TaskLabelsModel> {
        return this.table.add(entry).then(insertedId=>{
            return this.table.get(insertedId);
        });
    }

    public remove(entry: TaskLabelsModel): Promise<void> {
        return this.table.where({
            'taskId': entry.getTaskId(),
            'labelId': entry.getLabelId()
        }).delete().then(()=>{
            return Promise.resolve();
        });
    }

    public removeByTaskId(taskId: number): Promise<void> {
        return this.table.where('taskId').equals(taskId).delete().then(()=>{
            return Promise.resolve();
        });
    }

    public removeByLabelId(labelId: number): Promise<void> {
        return this.table.where('labelId').equals(labelId).delete().then(()=>{
            return Promise.resolve();
        });
    }
}