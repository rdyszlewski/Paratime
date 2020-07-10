import { Status } from './status';
import { Project } from './project';

export class Stage{
    
    private id: number;
    private name: string;
    private description: string;
    private endDate: Date;
    private status: Status;
    private project: Project;
    private projectID: number;

    public getId():number{
        return this.id;
    }

    public setId(id:number):void{
        this.id = id;
    }

    public getName():string{
        return this.name;
    }

    public setName(name:string):void{
        this.name = name;
    }

    public getDescription():string{
        return this.description;
    }

    public setDescription(description:string):void{
        this.description = description;
    }

    public getEndDate():Date{
        return this.endDate;
    }

    public setEndDate(date:Date){
        this.endDate = date;
    }

    public getStatus():Status{
        return this.status;
    }

    public setStatus(status:Status):void{
        this.status = status;
    }

    public setProject(project:Project):void{
        this.project = project;
        if(project){
            this.projectID = project.getId();
        }
    }

    public getProjectID():number{
        return this.projectID;
    }

    public setProjectID(id:number){
        this.projectID = id;
    }
}