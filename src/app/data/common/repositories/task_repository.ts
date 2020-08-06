import { Task } from 'app/models/task';
import { Status } from 'app/models/status';

export interface ITaskRepository{
    findTaskById(id:number):Promise<Task>;
    findTasksByProject(projectId:number):Promise<Task[]>;
    findTasksByLabel(label:string):Promise<Task[]>;
    findTasksByName(name:string):Promise<Task[]>;
    findTasksByDescription(description:string): Promise<Task[]>;
    findTasksByDate(date:Date):Promise<Task[]>;
    findTasksByDeadlineDate(date:Date):Promise<Task[]>;
    findTasksByStatus(projectId: number, status:Status):Promise<Task[]>;
    findTasksExceptStatus(projectId:number, status:Status):Promise<Task[]>;
    findImportantTasks():Promise<Task[]>;
    findFirstTask(projectId: number):Promise<Task>;
    findLastTask(projectId: number):Promise<Task>;
    findFirstTaskWithStatus(projectId, status:Status): Promise<Task>;
    insertTask(task:Task):Promise<number>;
    updateTask(task:Task):Promise<number>;
    removeTask(id:number):Promise<void>;
    removeTasksByProject(projectId: number):Promise<void>;
}
