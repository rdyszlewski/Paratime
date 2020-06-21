import { ITaskRepository } from '../common/task_repository';
import { Task } from 'app/models/task';
import { LocalDataSource } from './source';
import { LocalDatabase } from './database';

export class LocalTaskRepository implements ITaskRepository{

    private database: LocalDatabase;

    constructor(database:LocalDatabase){
        this.database = database;
    }

    public findTaskById(id: number): Task {
        throw new Error("Method not implemented.");
    }

    public findTasksByProject(projectId: number): Task[] {
        throw new Error("Method not implemented.");
    }

    public findTasksByTag(tag: string): Task[] {
        throw new Error("Method not implemented.");
    }

    public findTasksByName(name: string): Task[] {
        throw new Error("Method not implemented.");
    }

    public findTasksByDescription(description: string): Task[] {
        throw new Error("Method not implemented.");
    }

    public findTasksByDeadlineDate(date: Date): Task[] {
        throw new Error("Method not implemented.");
    }
    
    public insertTask(task: Task): Task {
        throw new Error("Method not implemented.");
    }

    public updateTask(task: Task): Task {
        throw new Error("Method not implemented.");
    }

    public removeTask(id: number): void {
        throw new Error("Method not implemented.");
    }

    public removeTasksByProject(projectId: number): void {
        throw new Error("Method not implemented.");
    }

}