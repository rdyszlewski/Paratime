import { State } from './state';
import { PomodoroSetting } from './settings';
import { PomodoroTimer } from './timer';
import { PomodoroSettingsStore } from './storage/settings.storage';
import { Task } from 'app/data/models/task';

export class PomodoroModel{

    private settings: PomodoroSetting = new PomodoroSetting();
    private timer: PomodoroTimer = new PomodoroTimer();
    private currentTask: Task;

    private settingsOpen: boolean = false;


    constructor(){
        this.timer.setSettings(this.settings);
        this.initSettings();
    }

    private initSettings():void{
        const settings = PomodoroSettingsStore.getSettings();
        if(settings){
            this.settings = settings;
        } else {
            this.setDefaultSettings();
        }
        this.timer.setSettings(this.settings);
    }

    private setDefaultSettings() {
        this.settings.setWorkTime(25);
        this.settings.setShortBreakTime(5);
        this.settings.setLongBreakTime(15);
        this.settings.setInterval(2);
    }

    public getSettings(){
        return this.settings;
    }

    public getTimer(){
        return this.timer;
    }

    public isSettingsOpen():boolean{
        return this.settingsOpen;
    }

    public toggleSettingsOpen(){
        this.settingsOpen = !this.settingsOpen;
    }

    public isIgnoreBreakVisible(){
        return this.timer.getState() == State.WORK && this.timer.isStateFinished();
    }

    public getCurrentTask():Task{
        return this.currentTask;
    }

    public setCurrentTask(task: Task):void{
        this.currentTask = task;
    }


}
