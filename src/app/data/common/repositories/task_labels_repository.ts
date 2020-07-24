import { LabelsTask as LabelsTask } from '../models';

export interface ITaskLabelsRepository{

    findByTaskId(taskId: number): Promise<LabelsTask[]>;
    findByLabelId(labelId: number): Promise<LabelsTask[]>;
    insert(entry: LabelsTask): Promise<LabelsTask>;
    remove(entry: LabelsTask): Promise<void>;
    removeByTaskId(taskId: number): Promise<void>;
    removeByLabelId(labelId: number): Promise<void>;
}