import { Subtask } from 'app/models/subtask';

export interface ISubtaskRepository{
    findSubtaskById(id: number):Subtask;
    findSubtasksByTask(taskId:number):Subtask[];
    insertSubtask(subtask:Subtask):Subtask;
    updateSubtask(subtask:Subtask):Subtask;
    removeSubtask(id: number):void;
}