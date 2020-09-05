import { ProjectDetails } from './model';

export class ProjectDetailsState{

    private model: ProjectDetails;

    constructor(model: ProjectDetails){
        this.model = model;
    }

    public isDescriptionExpanded():boolean{
        return this.model.getProject().getDescription() != null;
    }

    public isTypeExpanded():boolean{
        return this.model.getProject().getType != null;
    }

    public isStateExpanded():boolean{
        return this.model.getProject().getStatus() != null;
    }

    public isStartDateExpanded():boolean{
        return this.model.getProject().getStartDate() != null;
    }

    public isEndDateExpanded():boolean{
        return this.model.getProject().getEndDate() != null;
    }

    public isStagesExpanded():boolean{
        return this.model.getProject().getStages().length > 0;
    }
}