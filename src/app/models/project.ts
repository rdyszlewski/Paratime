import { Status } from './status';
import { Task } from './task';
import { ProjectType } from './project_type';

export class Project{
    
    private id: number;
    private name: string;
    private description: string;
    private startDate: Date;
    private endDate:Date;
    private status: Status;
    private tasks: Task[] = [];
    private type: ProjectType;


    public getId(){
        return this.id;
    }

    public setId(id:number){
        this.id = id;
    }

    public getName(){
        return this.name;
    }

    public setName(name: string){
        this.name = name;
    }

    public getDescription(){
        return this.description;
    }

    public setDescription(description:string){
        this.description = description;
    }

    public getStartDate(){
        return this.getStartDate;
    }

    public setStartDate(date: Date){
        this.startDate = date;
    }

    public getEndDate(){
        return this.endDate;
    }

    public setEndDate(date: Date){
        this.endDate = date;
    }

    public getStatus(){
        return this.status;
    }

    public setStatus(status: Status){
        this.status = status;
    }

    public addTask(task:Task){
        this.tasks.push(task);
    }

    public removeTask(task: Task){
        let index = this.getTaskIndex(task);
        if(index > 0){
            delete this.tasks[index];
        }
    }

    private getTaskIndex(task:Task){
        for(let i =0; i < this.tasks.length; i++){
            if(this.tasks[i].getId() === task.getId()){
                return i;
            }
        }
        return -1;
    }

    public setTasks(tasks: Task[]){
        this.tasks = tasks;
    }

    public getType(){
        return this.type;
    }

    public setType(type: ProjectType){
        this.type = type;
    }


}