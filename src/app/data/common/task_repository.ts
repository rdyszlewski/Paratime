import { Task } from 'app/models/task';
import { PromiseExtended } from 'dexie';

export interface ITaskRepository{
    findTaskById(id:number):Promise<Task>;
    findTasksByProject(projectId:number):Promise<Task[]>;
    findTasksByTag(tag:string):Promise<Task[]>;
    findTasksByName(name:string):Promise<Task[]>;
    findTasksByDescription(description:string): Promise<Task[]>;
    findTasksByDeadlineDate(date:Date):Promise<Task[]>;
    insertTask(task:Task):Promise<Task>;
    updateTask(task:Task):Promise<Task>;
    removeTask(id:number):Promise<void>;
    removeTasksByProject(projectId: number):Promise<void>;
}