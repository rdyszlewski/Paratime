import { Subtask } from 'app/models/subtask';
import { PromiseExtended } from 'dexie';

export interface ISubtaskRepository{
    findSubtaskById(id: number):Promise<Subtask>;
    findSubtasksByTask(taskId:number):Promise<Subtask[]>;
    insertSubtask(subtask:Subtask):Promise<Subtask>;
    updateSubtask(subtask:Subtask):Promise<Subtask>;
    removeSubtask(id: number):Promise<void>;
}