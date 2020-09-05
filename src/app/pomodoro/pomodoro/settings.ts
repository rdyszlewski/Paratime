export class PomodoroSetting{

    private workTime:number;
    private shortBreakTime: number;
    private longBreakTime: number;
    private interval: number;

    public getWorkTime():number{
        return this.workTime;
    }

    public setWorkTime(time:number):void{
        this.workTime = time;
    }

    public getShortBreakTime():number{
        return this.shortBreakTime;
    }

    public setShortBreakTime(time:number):void{
        this.shortBreakTime = time;
    }

    public getLongBreakTime():number{
        return this.longBreakTime;
    }

    public setLongBreakTime(time:number):void{
        this.longBreakTime = time;
    }

    public getInterval():number{
        return this.interval;
    }

    public setInterval(interval:number):void{
        this.interval = interval;
    }
}