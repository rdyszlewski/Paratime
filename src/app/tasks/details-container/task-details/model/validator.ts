import { TaskDetails } from './model';

export class TaskValidator{

    private model: TaskDetails;

    constructor(model:TaskDetails){
        this.model = model;
    }

    public isNameValid():boolean{
        return this.model.getTask().name != null;
    }

    public isValid():boolean{
        return this.isNameValid();
    }
}
