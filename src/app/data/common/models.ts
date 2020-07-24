
export class LabelsTask{

    private taskId: number;
    private labelId: number;

    constructor(taskId: number, labelId:number){
        this.taskId = taskId;
        this.labelId = labelId;
    }

    public getTaskId(){
        return this.taskId;
    }

    public setTaskId(id: number){
        this.taskId = id;
    }

    public getLabelId(){
        return this.labelId;
    }

    public setLabelId(id: number){
        this.labelId = id;
    }
}