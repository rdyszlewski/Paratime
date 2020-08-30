import { State } from './state';
import { interval, timer } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { PomodoroSetting } from './settings';
import { EventEmitter } from '@angular/core';
import { DataService } from 'app/data.service';
import { PomodoroHistory } from 'app/data/models/pomodoro.history';

// TODO: zrobić refaktoryzację całej klasy
export class PomodoroTimer{

    private settings: PomodoroSetting;

    private counter = 0;

    private time: number = 0;
    private stateTime: number = 0;
    private timerRunning = false;
    private timerPause = false;

    private currentState: State = State.WORK;
    private stateFinished = false;
    private currentInterval = 1;
    private currentStep = 0;

    private timeEmitter: EventEmitter<string>;
    private endEmitter: EventEmitter<PomodoroHistory>;

    public setTimeEmitter(emitter:EventEmitter<string>) {
        this.timeEmitter = emitter;
    }

    public setEndEmitter(emitter:EventEmitter<PomodoroHistory>){
        this.endEmitter = emitter;
    }

    public setSettings(settings: PomodoroSetting){
        this.settings = settings;
    }

    public getTimeText():string{
        const minutes = Math.floor(this.time / 60);
        const seconds = this.time % 60;
        const text = this.formatTime(minutes, seconds);
        return text;
    }

    private formatTime(minutes:number, seconds:number){
        return this.pad(minutes, 2) + ":" + this.pad(seconds, 2);
    }

    private pad(num:number, size:number): string {
        let s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }

    public tick(){
        this.time--;
        this.stateTime++;
        if(this.time < 0){
            this.time = 0;
            this.timerRunning = false;
            this.stateFinished = true;
        } else if(this.timeEmitter){
            this.timeEmitter.emit(this.getTimeText());
        }
    }

    public isTimerRunning():boolean{
        return this.timerRunning;
    }

    public isTimerPause():boolean{
        return this.timerPause;
    }

    public pauseTimer(){
        this.timerPause = true;
    }

    // TODO: refaktoryzacja
    public startTimer(){
        // TODO: pobieranie wartości czasu jaki ma zostać ustawiony (i czy ma zostać ustawiony)
        if(this.stateFinished){
            this.setNextState();
            if(this.currentState == State.WORK){
                this.currentInterval++;
            }
            this.stateFinished = false;
        }
        this.timerRunning = true;
        if(!this.isTimerPause() || this.time == 0){
            // TODO: W przypadku dodania czasu to się psuje
            if(this.time == 0){
                this.setStateTime();
                // TODO: sprawdzić, czy jest ok
                this.stateTime = 0;
            }
            this.startTicking();
            this.timerPause = false;
        }
        this.timerPause = false;
    }

    private setStateTime(){
        const stateTime = this.getStateTime()
        // TODO: pomonożyć prz 60;
        this.time = stateTime;
    }

    private getStateTime(){
        switch(this.currentState){
            case State.WORK:
                return this.settings.getWorkTime();
            case State.SHORT_BREAK:
                return this.settings.getShortBreakTime();
            case State.LONG_BREAK:
                return this.settings.getLongBreakTime();
        }
    }

    public stopTimer(){
        // TODO:
        this.timerRunning = false;
        this.timerPause = false;
        this.stateFinished = true;

        this.time = 0;

    }

    private startTicking(){
        // prevent against running many counter at the same time
        this.counter ++;
        const counter = this.counter;
        interval(1000)
            .pipe(takeWhile(() => this.isTimerRunning()))
            .subscribe(() => {
                if(!this.isTimerPause() && counter == this.counter){
                    this.tick();
                }
        });
    }

    public isStateFinished(){
        return this.stateFinished;
    }

    public setNextState(){
        // TODO: w tym miejscu prawdopodobnie powinno być zapisywanie czasu
        this.saveStatistics();

        const state = this.getNextState();
        this.currentState = state;
        this.currentStep++;
        if(this.currentStep >= this.settings.getInterval() * 2){
            this.currentStep = 0;
        }
    }

    private saveStatistics(){
        // TODO: robić zapisywanie czasu rzeczywistego
        // TODO: prześledzić to wszystko
        const time = this.stateTime - 1;

        const entry = new PomodoroHistory();
        entry.setTime(time);
        entry.setDate(new Date());
        this.endEmitter.emit(entry);
    }


    public getNextState(){
        if(this.currentState == State.WORK){
            if(this.settings.getInterval() == this.currentInterval){
                return State.LONG_BREAK;
            }
            return State.SHORT_BREAK;
        }
        return State.WORK;
    }

    public ignoreBreak(){
        // TODO: zrobić coś, żeby tutaj nie naliczało czasu (jak będzie zrobione naliczanie)
        this.currentInterval++;
        if(this.currentInterval > this.settings.getInterval()){
            this.currentInterval = 1;
        }
        this.setNextState();
        this.startTimer();
    }

    public getState():State{
        return this.currentState;
    }

    public addTime(){
        const timeToAdd = 5 * 60;
        this.time += timeToAdd;
        this.stateFinished = false;
        this.startTimer();
    }

    public getStep(){
        return this.currentStep;
    }
}
