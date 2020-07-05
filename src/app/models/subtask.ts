import { Status } from './status';

export class Subtask{
    
    private id: number;
    private name: string = null;
    private description: string = null;
    private status: Status = null;
    private progress: number = -1;
    private taskId: number = null;

    constructor(name=null, description=null, status=null){
        this.name = name;
        this.description = description;
        this.status = status;
    }

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
    
    public getTaksId(){
        return this.taskId;
    }

    public setTaskId(id: number){
        this.taskId = id;
    }
       
}