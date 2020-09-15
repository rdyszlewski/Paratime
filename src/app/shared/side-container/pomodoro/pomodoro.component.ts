import { Component, OnInit } from '@angular/core';
import { Task } from 'app/database/data/models/task';
import { PomodoroSummaryAdapter } from 'app/database/data/models/pomodoro.history';
import { DataService } from 'app/data.service';
import { State, TimerState, BreakHelper } from 'app/pomodoro/pomodoro/shared/state';
import { PomodoroService, CallbackType } from 'app/pomodoro/pomodoro/pomodoro.service';
import { PomodoroSummary } from 'app/pomodoro/pomodoro/statistics/summary';
import { PomodoroTickCallback, PomodoroEndCallback } from 'app/pomodoro/pomodoro/pomodoro.callbacks';
import { MatDialog } from '@angular/material/dialog';
import { DialogHelper } from 'app/shared/common/dialog';
import { PomodoroAdapter } from 'app/shared/adapters/pomodoro.adapter';



@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrls: ['./pomodoro.component.css']
})
export class PomodoroComponent implements OnInit {

  private _settingsOpen = false;
  public state = State;
  public timerState = TimerState;

  constructor(private pomodoroService: PomodoroService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.pomodoroService.setSaveSummaryCallback(summary=>this.saveSummary(summary));
    this.pomodoroService.setQuestionCallback(CallbackType.SAVE_SUMMARY, ()=>{
      return this.showSaveStatisticsQuestion();
    });
    this.pomodoroService.setQuestionCallback(CallbackType.STOP, ()=>{
      return this.showStopStateQuestion();
    });
    this.pomodoroService.setQuestionCallback(CallbackType.SKIP, ()=>{
      return this.showSkipStateQuestion();
    });
  }



private saveSummary(summary: PomodoroSummary){
    console.log("Zapisywanie pomodoro");
    const history = PomodoroSummaryAdapter.createHistory(summary);
    DataService.getStoreManager().getPomodoroStore().create(history).then(savedSummary=>{
      console.log(savedSummary);
    });

  }

  private showSaveStatisticsQuestion():Promise<boolean>{
    const message = "Czy zapisać wyniki";
    return this.showDialog(message);
  }

  private showDialog(message: string):Promise<boolean>{
    return DialogHelper.openDialog(message, this.dialog).toPromise();
  }

  public showStopStateQuestion():Promise<boolean>{
    const message = "Czy przerwać obecny stan?";
    return this.showDialog(message);
  }

  public showSkipStateQuestion(): Promise<boolean>{
    const message = "Czy pominąć obecny stan?";
    return this.showDialog(message);
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

  // TODO: sprawdzić, czy to jest gdzieś wykorzystywane
  public addTaskToPomodoro(task:Task){
    this.service.setTask(PomodoroAdapter.createPomodoroTask(task));
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
