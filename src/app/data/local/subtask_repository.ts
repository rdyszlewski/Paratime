import { ISubtaskRepository } from '../common/subtask_repository';
import { Subtask } from 'app/models/subtask';
import { LocalDatabase } from './database';

export class LocalSubtaskRepository implements ISubtaskRepository{

    private database:LocalDatabase;

    constructor(database:LocalDatabase){
        this.database = database;
    }

    public findSubtaskById(id: number): Subtask {
        throw new Error("Method not implemented.");
    }

    public findSubtasksByTask(taskId: number): Subtask[] {
        throw new Error("Method not implemented.");
    }

    public insertSubtask(subtask: Subtask): Subtask {
        throw new Error("Method not implemented.");
    }

    public updateSubtask(subtask: Subtask): Subtask {
        throw new Error("Method not implemented.");
    }

    public removeSubtask(id: number): void {
        throw new Error("Method not implemented.");
    }

}