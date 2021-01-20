import { ProjectDetails } from './model';

export class ProjectValidator{

    private model: ProjectDetails;

    constructor(model: ProjectDetails){
        this.model = model;
    }

    public isNameValid():boolean{
        return this.model.getProject().name != null
        && this.model.getProject().name!= "";
    }

    public isEndDateValid():boolean{
        const project = this.model.getProject();
        if(project.startDate != null && project.endDate != null){
            return project.endDate >= project.startDate;
        }
        return true;
    }

    public isValid(): boolean{
        return this.isNameValid() && this.isEndDateValid();
    }
}
