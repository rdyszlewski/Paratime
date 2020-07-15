import { TaskDetails } from './model';

export class TaskViewState{

    private model: TaskDetails;

    constructor(model:TaskDetails){
        this.model = model;
    }

    public isDescriptionExtended(){
        return this.model.getTask().getDescription() != null;
    }
 
    public isStatusExtended(){
        return this.model.getTask().getStatus()!=null;
    }
 
    public isDateExtended(){
        return this.model.getTask().getDate() != null;
    }
 
    public isEndDateExtended(){
        return this.model.getTask().getEndDate() != null;
    }
 
    public isPlannedTimeExtended(){
        return this.model.getTask().getPlannedTime() != null;
    }
 
    public isProjectExtended(){
        return this.model.getTask().getProject() != null;
    }
 
    public isLabelsExtended(){
        return this.model.getTask().getLabels().length > 0;
    }
 
    public isSubtasksExtended(){
        return this.model.getTask().getSubtasks().length > 0;
    }
 
    public isPriorityExtended(){
        return this.model.getTask().getPriority() != null;
    }

    public isStageExtended():boolean{
        return this.model.getTask().getProjectStageID() != null;
    }
}