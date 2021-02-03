import { TaskDetails } from './model';

export class TaskViewState{

    private model: TaskDetails;

    constructor(model:TaskDetails){
        this.model = model;
    }

    public isDescriptionExtended(){
        return this.model.getTask().description != null;
    }

    public isStatusExtended(){
        return this.model.getTask().status!=null;
    }

    public isDateExtended(){
        return this.model.getTask().date != null;
    }

    public isEndDateExtended(){
        return this.model.getTask().endDate != null;
    }

    public isPlannedTimeExtended(){
        return this.model.getTask().plannedTime != null;
    }

    public isProjectExtended(){
        return this.model.getTask().project != null;
    }

    public isLabelsExtended(){
        return this.model.getTask().labels.length > 0;
    }

    public isSubtasksExtended(){
        return this.model.getTask().subtasks.length > 0;
    }

    public isPriorityExtended(){
        return this.model.getTask().priority != null;
    }

    public isStageExtended():boolean{
        return this.model.getTask().projectStageID != null;
    }
}
