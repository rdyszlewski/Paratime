import { Status } from './status';

export class Subtask{
    
    private id: number;
    private name: string = null;
    private status: Status = null;
    private taskId: number = null;

    constructor(name=null, status=null){
        this.name = name;
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

    public getStatus(){
        return this.status;
    }

    public setStatus(status:Status){
        this.status = status;
    }

    public getTaksId(){
        return this.taskId;
    }

    public setTaskId(id: number){
        this.taskId = id;
    }
       
}