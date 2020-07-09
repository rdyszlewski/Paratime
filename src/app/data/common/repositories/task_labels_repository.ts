import { TaskLabelsModel as TaskLabelsModel } from '../models';

export interface ITaskLabelsRepository{

    findByTaskId(taskId: number): Promise<TaskLabelsModel[]>;
    findByLabelId(labelId: number): Promise<TaskLabelsModel[]>;
    insert(entry: TaskLabelsModel): Promise<TaskLabelsModel>;
    remove(entry: TaskLabelsModel): Promise<void>;
    removeByTaskId(taskId: number): Promise<void>;
    removeByLabelId(labelId: number): Promise<void>;
}