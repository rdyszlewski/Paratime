import { Task } from 'app/models/task';

export interface ITaskRepository{
    findTaskById(id:number):Task;
    findTasksByProject(projectId:number):Task[];
    findTasksByTag(tag:string):Task[];
    findTasksByName(name:string):Task[];
    findTasksByDescription(description:string):Task[];
    findTasksByDeadlineDate(date:Date):Task[];
    insertTask(task:Task):Task;
    updateTask(task:Task):Task;
    removeTask(id:number):void;
    removeTasksByProject(projectId: number):void;
}