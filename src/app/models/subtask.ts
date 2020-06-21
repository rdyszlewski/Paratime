import { Status } from './status';

export class Subtask{
    
    private id: number;
    private name: string;
    private description: string;
    private status: Status;
    private progress: number;
    private taskID: number;

    public getId(){
        return this.id;
    }

    public setId(id: number){
        this.id = id;
    }

    public getName(){
        return this.name;
    }

    public setName(name:string){
        this.name = name;
    }

    public getDescription(){
        return this.description;
    }

    public setDescription(description: string){
        this.description = description;
    }

    public getStatus(){
        return this.status;
    }

    public setStatus(status:Status){
        this.status = status;
    }

    public getProgress(){
        return this.progress;
    }

    public setProgress(progress:number){
        this.progress = progress;
    }
    
    public getTaksID(){
        return this.taskID;
    }

    public setTaskID(id: number){
        this.taskID = id;
    }
    
    
}