import { Injectable } from '@angular/core';
import {  IPomodoroTimer, ITimerControl, ITimerInfo } from './timer/timer';
import { IPomodoroTask } from './model/task';
import { PomodoroStateSummary } from './timer/summary';
import { IPomodoroCallbacks, PomodoroTickCallback, PomodoroEndCallback, SaveSummaryCallback as SaveSummaryCallback } from './pomodoro.callbacks';
import { SummaryCreator } from './statistics/summary.creator';
import { PomodoroSettings } from './settings/settings';
import { SaveStatisticsChecker, Answer } from './statistics/checker';
import { PomodoroSummary } from './statistics/summary';
import { TimerFormatter } from './shared/formatter';
import { SettingsController } from './settings/settings.controller';
import { PomodoroTimer } from './timer/pomodoro.timer';
import { ChangeStateCause } from './shared/change.cause';

export type QuestionCallback = ()=>Promise<boolean>;

export enum CallbackType{
  SAVE_SUMMARY,
  STOP,
  SKIP
}

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

  private _summariesToSave: PomodoroSummary[] = [];

  private _changeStateCause: ChangeStateCause;
  // TODO: zastanowić się, czy to powinno wyglądać w ten sposób
  public get task(): IPomodoroTask{
    return this._task;
  }

  public get settings(): PomodoroSettings{
    return this._settings;
  }

  constructor() {
    this._settings = SettingsController.getSettings();
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
    console.log("Finish Ticking");
    this.addSummaryToSave(summary);
    if(this._summariesToSave.length <= 0){      console.log("Ważne");

      return;
    }
    // TODO: sprawdzić, czy na pewno tak będzie
    this.saveSummaries(summary, this._changeStateCause);
  }

  private saveSummaries(summary: PomodoroStateSummary, cause: ChangeStateCause) {
    // TODO: sprawdzić wszystkie warunki
    if(!cause){
      cause = ChangeStateCause.FINISH;
    }
    const isSave = SaveStatisticsChecker.isSaveStatistics(summary.state, this._settings, cause);
    if (isSave == Answer.ASK) {
      this._questionCallbacks.get(CallbackType.SAVE_SUMMARY)().then(answer => {
        this.runSavingSummaries();
      });
    } else if (isSave == Answer.YES) {
      this.runSavingSummaries();
    }
    this._changeStateCause = null;
  }

  private runSavingSummaries() {
    if(!this._saveSummaryCallback){
      return;
    }
    this._summariesToSave.forEach(summaryToSave => {
      this._saveSummaryCallback(summaryToSave);
    });
    this._summariesToSave = [];
  }

  private addSummaryToSave(summary: PomodoroStateSummary) {
    if(this.isSummaryValid(summary)){
      const finishDate = new Date();
      const pomodoroSummary = SummaryCreator.createPomodoroSummary(summary, this._task, this._settings, this._stateStartDate, finishDate);
      this._summariesToSave.push(pomodoroSummary);
      return pomodoroSummary;
    }
    return null;
  }

  private isSummaryValid(summary: PomodoroStateSummary){
    return summary.time > this._settings.saveStateLongerThan;
  }

  public setTask(task: IPomodoroTask){
    if(this._timer.isTicking()){
      this._changeStateCause = ChangeStateCause.TASK_CHANGED;
      const summary = this._timer.getSummary();
      this.addSummaryToSave(summary);
      this._timer.resetStateTime();
    }
    this._task = task;
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
    SettingsController.saveSettings(this._settings);
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
          this._changeStateCause = ChangeStateCause.STOP;
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

  public resume() {
    this._timer.resume();
  }

  public continueState() {
    this._timer.continueState();
  }

  public skipState() {
    if(this._questionCallbacks.has(CallbackType.SKIP)){
      this._questionCallbacks.get(CallbackType.SKIP)().then(result=>{
        if(result){
          this._changeStateCause = ChangeStateCause.SKIP;
          this._timer.skipState();
        }
      });
    }
  }

  public addTime(time: number) {
    this._timer.addTime(time);
  }
}
