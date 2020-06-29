import { ITaskTagsRepository } from '../common/task_tags_repository';
import { TaskTagsModel } from '../common/models';

export class LocalTagsTaskRepository implements ITaskTagsRepository{

    private table: Dexie.Table<TaskTagsModel, number>;

    constructor(table: Dexie.Table<TaskTagsModel, number>){
        this.table = table;
    }

    public findByTaskId(taskId: number): Promise<TaskTagsModel[]> {
        return this.table.where('taskId').equals(taskId).toArray();
    }

    public findByTagId(tagId: number): Promise<TaskTagsModel[]> {
        return this.table.where('tagId').equals(tagId).toArray();
    }

    public insert(entry: TaskTagsModel): Promise<TaskTagsModel> {
        return this.table.add(entry).then(insertedId=>{
            return this.table.get(insertedId);
        });
    }

    public remove(entry: TaskTagsModel): Promise<void> {
        return this.table.where({
            'taskId': entry.getTaskId(),
            'tagId': entry.getTagId()
        }).delete().then(()=>{
            return Promise.resolve();
        });
    }

    public removeByTaskId(taskId: number): Promise<void> {
        return this.table.where('taskId').equals(taskId).delete().then(()=>{
            return Promise.resolve();
        });
    }

    public removeByTagId(tagId: number): Promise<void> {
        return this.table.where('tagId').equals(tagId).delete().then(()=>{
            return Promise.resolve();
        });
    }
}