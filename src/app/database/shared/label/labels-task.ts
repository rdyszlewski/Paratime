
export class LabelsTask{

    private _taskId: number;
    private _labelId: number;

    constructor(taskId: number, labelId:number){
        this._taskId = taskId;
        this._labelId = labelId;
    }

    public get taskId(){
        return this._taskId;
    }

    public set taskId(id: number){
        this._taskId = id;
    }

    public get labelId(){
        return this._labelId;
    }

    public set labelId(id: number){
        this._labelId = id;
    }
}
