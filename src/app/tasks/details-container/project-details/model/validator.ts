import { ProjectDetails } from './model';

export class ProjectValidator{
    
    private model: ProjectDetails;

    constructor(model: ProjectDetails){
        this.model = model;
    }

    public isNameValid():boolean{
        return this.model.getProject().getName() != null 
        && this.model.getProject().getName()!= "";
    }

    public isEndDateValid():boolean{
        const project = this.model.getProject();
        if(project.getStartDate() != null && project.getEndDate() != null){
            return project.getEndDate() >= project.getStartDate(); 
        }
        return true;
    }

    public isValid(): boolean{
        return this.isNameValid() && this.isEndDateValid();
    }
}