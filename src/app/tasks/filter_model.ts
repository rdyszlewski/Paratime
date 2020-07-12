import { Status } from 'app/models/status';
import { Stage } from 'app/models/stage';
import { Label } from 'app/models/label';

export class TaskFilterModel{

    private important:boolean;
    private withEndDate:boolean;
    private status:Status;
    private stage:Stage;
    private label:Label;

    constructor(){
        this.clear();
    }

    public isImportant():boolean{
        return this.important;
    }

    public setImportant(important:boolean):void{
        this.important = important;
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

    public getStage():Stage{
        return this.stage;
    }

    public setStage(stage:Stage):void{
        this.stage = stage;
    }

    public getLabel():Label{
        return this.label;
    }

    public setLabel(label:Label):void{
        this.label = label;
    }

    public clear(){
        this.important = false;
        this.withEndDate = false;
        this.status = null;
        this.stage = null;
        this.label = null;
    }
}