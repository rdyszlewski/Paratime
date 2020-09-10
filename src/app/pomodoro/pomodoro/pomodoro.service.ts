import { Injectable } from '@angular/core';
import { PomodoroTimer, IPomodoroTimer, ITimerControl, ITimerInfo } from './timer/timer';
import { IPomodoroTask } from './model/task';
import { PomodoroStateSummary } from './timer/summary';
import { IPomodoroCallbacks, PomodoroTickCallback, PomodoroEndCallback, SaveSummaryCallback as SaveSummaryCallback } from './pomodoro.callbacks';
import { SummaryCreator } from './statistics/summary.creator';
import { SettingsInitializator } from './settings/initializator';
import { TimerFormatter } from './timer/formatter';
import { PomodoroSettings } from './settings/settings';
import { PomodoroSettingsStore } from './settings/settings.storage';
import { MatDialog } from '@angular/material/dialog';
import { SaveStatisticsChecker, Answer } from './statistics/checker';

export type QuestionCallback = ()=>Promise<boolean>;

export enum CallbackType{
  SAVE_SUMMARY,
  STOP,
  SKIP
}

// TODO: to chyba będzie trzeba zmienić, żeby było dostepne wyłączenie w PomodoroModule
@Injectable({
  providedIn: "root"
})
export class PomodoroService implements IPomodoroCallbacks, ITimerControl {

  private _timer: IPomodoroTimer;
  private _task: IPomodoroTask;
  private _settings: PomodoroSettings;

  private _tickCallbacks: Map<string, PomodoroTickCallback> = new Map();
  private _endCallbacks: Map<string, PomodoroEndCallback> = new Map();
  private _questionCallbacks: Map<CallbackType, QuestionCallback> = new Map();
  private _saveSummaryCallback: SaveSummaryCallback;

  private _stateStartDate: Date;

  // TODO: zastanowić się, czy to powinno wyglądać w ten sposób
  public get task(): IPomodoroTask{
    return this._task;
  }

  public get settings(): PomodoroSettings{
    return this._settings;
  }

  constructor(private dialog: MatDialog) {
    this._settings = PomodoroSettingsStore.getSettings();
    if(!this._settings){
      this._settings = SettingsInitializator.initializeSettings();
    }

    this._timer = new PomodoroTimer(this._settings,
      time=>this.tick(time),
      summary=>this.finishTicking(summary));
  }


  private tick(time: number){
    // TODO: zrobic coś, żeby można było zastępować formatery
    const timeText = TimerFormatter.getTimeText(time, this._timer.timerState());
    for(let [_, callback] of this._tickCallbacks){
      callback(timeText);
    }
  }

  private finishTicking(summary: PomodoroStateSummary){
    const finishDate = new Date();
    // TODO: sprawdzenie, czy potrzebny jest zapis
    // TODO: sprawdzić to
    const pomodoroSummary = SummaryCreator.createPomodoroSummary(summary, this._task, this._settings, this._stateStartDate, finishDate);
    if(SaveStatisticsChecker.isSaveStatistics(summary.state, this._settings, summary.finishCause)==Answer.ASK){
      this._questionCallbacks.get(CallbackType.SAVE_SUMMARY)().then(answer=>{
        pomodoroSummary.saveSummary = answer;
        if(this._saveSummaryCallback){
          this._saveSummaryCallback(pomodoroSummary);
        }
      });
    }
    // TODO: zastanowić się, czy to się jakoś nie popsuje, podczas zmiany zadania. To zadanie które chcemy zapisać prawdopodobnie nie będzie już aktualne
  }

  private startTimer(){
    console.log("Wystartowano zegar");
    this._stateStartDate = new Date();
  }

  public setTask(task: IPomodoroTask){
    this._task = task;
    // TODO: jeżeli licznik jest uruchomiony, oraz wczesniej było ustawione zadanie, to zapisujemy
  }

  public getTimerInfo(): ITimerInfo{
    return this._timer;
  }

  // TODO: czy timer powinien być chroniony, a wszystkie działania powinny byc wykonywane przez serwis

  public addTickCallback(name: string, callback: PomodoroTickCallback) {
    this._tickCallbacks.set(name, callback);
  }

  public removeTickCallback(name: string) {
    this._tickCallbacks.delete(name);
  }

  public addEndCallback(name: string, callback: PomodoroEndCallback) {
    this._endCallbacks.set(name, callback);
  }

  public removeEndCallback(name: string) {
    this._endCallbacks.delete(name);
  }

  public setQuestionCallback(type: CallbackType, callback: QuestionCallback){
    this._questionCallbacks.set(type, callback);
  }

  public setSaveSummaryCallback(callback: SaveSummaryCallback) {
    this._saveSummaryCallback = callback;
  }

  public getStepsNumber():number{
    return this._settings.interval * 2;
  }

  public time():string{
    return TimerFormatter.getTimeText(this._timer.time(), this._timer.timerState());
  }

  public updateSettings(){
    PomodoroSettingsStore.saveSettings(this._settings);
    // TODO: aktualizacja czasu
    this._timer.updateSettings(this._settings);
  }

  // TIMER CONTROL

  public start() {
    this._stateStartDate = new Date();
    this._timer.start();
  }

  public stop() {
    if(this._questionCallbacks.has(CallbackType.STOP)){
      this._timer.pause();
      this._questionCallbacks.get(CallbackType.STOP)().then(result=>{
        if(result){
          this._timer.stop();
        } else {
          this._timer.start();
        }
      });
    }
  }

  public pause() {
    this._timer.pause();
  }

  public continue() {
    this._timer.continue();
  }

  public continueState() {
    this._timer.continueState();
  }

  public skipState() {
    if(this._questionCallbacks.has(CallbackType.SKIP)){
      this._questionCallbacks.get(CallbackType.SKIP)().then(result=>{
        if(result){
          this._timer.skipState();
        }
      });
    }
  }

  public addTime(time: number) {
    this._timer.addTime(time);
  }
}
