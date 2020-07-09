import { Task } from 'app/models/task';

export interface ITaskRepository{
    findTaskById(id:number):Promise<Task>;
    findTasksByProject(projectId:number):Promise<Task[]>;
    findTasksByLabel(label:string):Promise<Task[]>;
    findTasksByName(name:string):Promise<Task[]>;
    findTasksByDescription(description:string): Promise<Task[]>;
    findTasksByDeadlineDate(date:Date):Promise<Task[]>;
    insertTask(task:Task):Promise<number>;
    updateTask(task:Task):Promise<number>;
    removeTask(id:number):Promise<void>;
    removeTasksByProject(projectId: number):Promise<void>;
}