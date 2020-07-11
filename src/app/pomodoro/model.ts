import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators'
import { State } from './state';
import { PomodoroSetting } from './settings';
import { PomodoroTimer } from './timer';

export class PomodoroModel{

    private settings: PomodoroSetting = new PomodoroSetting();
    private timer: PomodoroTimer = new PomodoroTimer();

    private settingsOpen: boolean = false;
    

    constructor(){
        this.timer.setSettings(this.settings);
        // TODO: później to usunąć
        this.settings.setWorkTime(25);
        this.settings.setShortBreakTime(5);
        this.settings.setLongBreakTime(15);
        this.settings.setInterval(2)
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
    
}