import { ProjectDetails } from './model';

export class ProjectDetailsState{

    private model: ProjectDetails;

    constructor(model: ProjectDetails){
        this.model = model;
    }

    public isDescriptionExpanded():boolean{
        return this.model.getProject().description != null;
    }

    public isTypeExpanded():boolean{
        return this.model.getProject().type != null;
    }

    public isStateExpanded():boolean{
        return this.model.getProject().status != null;
    }

    public isStartDateExpanded():boolean{
        return this.model.getProject().startDate != null;
    }

    public isEndDateExpanded():boolean{
        return this.model.getProject().endDate != null;
    }

    public isStagesExpanded():boolean{
        return this.model.getProject().stages.length > 0;
    }
}
