import { TaskTagsModel } from './models';

export interface ITaskTagsRepository{

    findByTaskId(taskId: number): TaskTagsModel[];
    findByTagId(tagId: number): TaskTagsModel[];
    insert(entry: TaskTagsModel): TaskTagsModel;
    remove(entry: TaskTagsModel): void;
    removeByTaskId(taskId: number): void;
    removeByTagId(tagId: number): void;
}