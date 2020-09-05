import { Status } from 'app/database/data/models/status';
import { ProjectType } from 'app/database/data/models/project_type';

export class ProjectFilterModel{

    private withEndDate:boolean;;
    private status:Status;;
    private projectType: ProjectType;

    constructor(){
        this.clear();
    }

    public isWithEndDate():boolean{
        return this.withEndDate;
    }

    public setWithEndDate(withEndDate:boolean):void{
        this.withEndDate = withEndDate;
    }

    public getStatus():Status{
        return this.status;
    }

    public setStatus(status:Status):void{
        this.status = status;
    }

    public getProjectType():ProjectType{
        return this.projectType;
    }

    public setProjectType(type:ProjectType):void{
        this.projectType = type;
    }

    public clear(){
        this.withEndDate = false;
        this.status = null;
        this.projectType = null;
    }
}
