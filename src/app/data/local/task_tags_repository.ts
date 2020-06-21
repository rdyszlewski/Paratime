import { ITaskTagsRepository } from '../common/task_tags_repository';
import { TaskTagsModel } from '../common/models';
import { LocalDatabase } from './database';

export class LocalTagsTaskRepository implements ITaskTagsRepository{

    private database: LocalDatabase;

    constructor(database: LocalDatabase){
        this.database = database;
    }

    public findByTaskId(taskId: number): TaskTagsModel[] {
        throw new Error("Method not implemented.");
    }

    public findByTagId(tagId: number): TaskTagsModel[] {
        throw new Error("Method not implemented.");
    }

    public insert(entry: TaskTagsModel): TaskTagsModel {
        throw new Error("Method not implemented.");
    }

    public remove(entry: TaskTagsModel): void {
        throw new Error("Method not implemented.");
    }

    public removeByTaskId(taskId: number): void {
        throw new Error("Method not implemented.");
    }

    public removeByTagId(tagId: number): void {
        throw new Error("Method not implemented.");
    }

}