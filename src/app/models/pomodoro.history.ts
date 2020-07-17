export class PomodoroHistory{
    
    private id: number;
    private taskId:number = null;
    private projectId:number = null;
    private time:number = null;
    private date:Date = null;

    public getId():number{
        return this.id;
    }

    public setId(id:number):void{
        this.id = id;
    }

    public getTaskId():number{
        return this.taskId;
    }

    public setTaskId(id:number):void{
        this.taskId = id;
    }

    public getProjectId():number{
        return this.projectId;
    }

    public setProjectId(id:number):void{
        this.projectId = id;
    }

    public getTime():number{
        return this.time;
    }

    public setTime(time:number):void{
        this.time = time;
    }

    public getDate():Date{
        return this.date;
    }

    public setDate(date:Date):void{
        this.date = date;
    }
}