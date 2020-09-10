import { Component, OnInit } from '@angular/core';
import { Task } from 'app/database/data/models/task';
import { PomodoroSummaryAdapter } from 'app/database/data/models/pomodoro.history';
import { DataService } from 'app/data.service';
import { State, TimerState, BreakHelper } from 'app/pomodoro/pomodoro/timer/state';
import { PomodoroService } from 'app/pomodoro/pomodoro/pomodoro.service';
import { PomodoroSummary } from 'app/pomodoro/pomodoro/statistics/summary';
import { PomodoroTickCallback, PomodoroEndCallback } from 'app/pomodoro/pomodoro/pomodoro.callbacks';
import { Pomodorotask } from 'app/pomodoro/pomodoro/model/task';



@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrls: ['./pomodoro.component.css']
})
export class PomodoroComponent implements OnInit {

  private _settingsOpen = false;
  private _time: string = "";
  public state = State;
  public timerState = TimerState;
  constructor(private pomodoroService: PomodoroService) { }

  ngOnInit(): void {
    // this.addEndCallback("save", (statistics)=>this.savePomodoroStatistics(statistics));
    this.addTickCallback("updateTime", (time)=>this.tick(time));
    this.addEndCallback("saveSummary", (summary)=>this.saveSummary(summary));
  }

  private tick(time: string){
    this._time = time;
  }

  private saveSummary(summary: PomodoroSummary){
    if(summary.saveSummary){
      console.log("Zapisywanie pomodoro");
      const history = PomodoroSummaryAdapter.createHistory(summary);
      DataService.getStoreManager().getPomodoroStore().create(history).then(savedSummary=>{
        console.log(savedSummary);
      });
    }
    // TODO: można zrobić jakiś komunikat
  }

  public get time():string{
    return this._time;
  }

  public get service():PomodoroService{
    return this.pomodoroService;
  }

  public get settingsOpen(): boolean{
    return this._settingsOpen;
  }

  public toggleSettingsOpen(){
    this._settingsOpen = !this._settingsOpen;
  }

  public addTickCallback(name: string, callback: PomodoroTickCallback){
    this.service.addTickCallback(name, callback);
  }

  public addEndCallback(name: string, callback: PomodoroEndCallback){
    this.service.addEndCallback(name, callback);
  }

  public removeTickCallback(name: string){
    this.service.removeTickCallback(name);
  }

  public removeEndCallback(name: string){
    this.service.removeEndCallback(name);
  }

  // TODO: refaktoryzacja
  public getStatesNumbers(){
    let numbers = [];
    for(let i =0; i<this.service.getStepsNumber(); i++){
      numbers.push(i);
    }
    return numbers;
  }

  public isWorkState(index:number){
    if(index % 2 == 0){
      return true;
    }
    return false;
  }

  public isShortBreakState(index:number){
    return index%2 != 0 && index != this.service.getStepsNumber() -1;
  }

  public isLongBreakState(index:number){
    return index == this.service.getStepsNumber() - 1;
  }

  public isCurrentState(index:number){
    return index == this.service.getTimerInfo().currentStep();
  }

  // TODO: przenieść do serwisu

  public addTaskToPomodoro(task:Task){
    this.service.setTask(this.createPomodoroTask(task));
  }

  private createPomodoroTask(task:Task){
    const pomodoroTask = new Pomodorotask();
    pomodoroTask.setTask(task.getId(), task.getName());
    pomodoroTask.setProject(task.getProject().getId(), task.getProject().getName());
    task.getLabels().forEach(label=>{
      pomodoroTask.addLabel(label.getId(), label.getName());
    });
    return pomodoroTask;
  }


  public isStoppedState(){
    return this.service.getTimerInfo().timerState() == TimerState.STOPED;
  }

  public isWorkFinishedState(){
    return this.service.getTimerInfo().currentState() == State.WORK
    && this.service.getTimerInfo().timerState() == TimerState.FINISHED;
  }

  public isRunningState(){
    return this.service.getTimerInfo().timerState() == TimerState.TICKING;
  }

  public isPausedState(){
    return this.service.getTimerInfo().timerState() == TimerState.PAUSED;
  }

  public isContinueState(){
    return this.service.getTimerInfo().timerState() == TimerState.CONTINUATION;
  }

  public isStopBreakState(){
    // TODO: spradzić, czy jest wpisany odpowiedni stan
    return this.service.getTimerInfo().timerState() == TimerState.STOPED
    && BreakHelper.isBreak(this.service.getTimerInfo().currentState());
  }
}
