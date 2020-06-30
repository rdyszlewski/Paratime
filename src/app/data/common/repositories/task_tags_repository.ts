import { TaskTagsModel } from '../models';

export interface ITaskTagsRepository{

    findByTaskId(taskId: number): Promise<TaskTagsModel[]>;
    findByTagId(tagId: number): Promise<TaskTagsModel[]>;
    insert(entry: TaskTagsModel): Promise<TaskTagsModel>;
    remove(entry: TaskTagsModel): Promise<void>;
    removeByTaskId(taskId: number): Promise<void>;
    removeByTagId(tagId: number): Promise<void>;
}