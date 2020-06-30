import { Subtask } from 'app/models/subtask';

export interface ISubtaskRepository{
    findSubtaskById(id: number):Promise<Subtask>;
    findSubtasksByTask(taskId:number):Promise<Subtask[]>;
    insertSubtask(subtask:Subtask):Promise<number>;
    updateSubtask(subtask:Subtask):Promise<number>;
    removeSubtask(id: number):Promise<void>;
    bulkRemoveSubtasks(ids: number[]):Promise<void>;
}