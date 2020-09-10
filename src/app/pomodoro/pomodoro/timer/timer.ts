import { State, TimerState, BreakHelper } from './state';
import { PomodoroSettings as PomodoroSettings, StateControl, SettingsAnswer } from '../settings/settings';
import { TimerFormatter } from './formatter';
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { StateInfo } from './state.info';
import { StateInfoCreator } from './state.info.creator';
import { PomodoroStateSummary } from './summary';

export type TimerTickCallback = (time: number)=>void;
export type TimerEndCallback = (summary: PomodoroStateSummary)=>void;

export enum ChangeStateCause{
  FINISH,
  STOP,
  SKIP
}

export interface ITimerControl{
  start();
  stop();
  pause();
  continue(); // TODO: co ja tutaj miałem na myśli
  continueState();
  skipState();
  addTime(time: number);
}

export interface ITimerCallbacks{
  setTickCallback(callback: TimerTickCallback);
  setEndCallback(callback: TimerEndCallback);
}

export interface ITimerInfo{
  isTicking(): boolean;
  currentStep():number;
  currentState():State;
  timerState(): TimerState;
  time(): number;
}

export interface IPomodoroTimer extends ITimerControl, ITimerCallbacks, ITimerInfo{
  updateSettings(settings: PomodoroSettings);
}


export class PomodoroTimer implements IPomodoroTimer{

  private _time: number = 0;
  private _stateTime: number = 0;
  private _stateInfo: StateInfo;
  private _timerState: TimerState = TimerState.STOPED;

  private _settings: PomodoroSettings;

  private _tickCallback: TimerTickCallback;
  private _endCallback: TimerEndCallback;
  // prevent running many countdowns in the same time
  private _currentCountdownID: number = 0;

  constructor(settings: PomodoroSettings, tickCallback: TimerTickCallback, endCallback: TimerEndCallback){
    this.setSettings(settings);
    this._tickCallback = tickCallback;
    this._endCallback = endCallback;
    this.updateTime();
  }

  public setTickCallback(callback: TimerTickCallback){
    this._tickCallback = callback;
  }

  public setEndCallback(callback: TimerEndCallback){
    this._endCallback = callback;
  }



  public setSettings(settings: PomodoroSettings){
    this._settings = settings;
    this._stateInfo = StateInfoCreator.getInitialStateInfo(this._settings);
    this.updateTime();
  }

  private updateTime(newState: boolean = true){
    this._time = this._stateInfo.time;
    if(newState){
      this._stateTime = 0;
    }
  }

  public start() {
    this.setupState();
    this._timerState = TimerState.TICKING;
    this.startTicking();
  }

  private setupState(){
    // TODO: tutaj nie powinno być też STOP?
    if(this._timerState == TimerState.FINISHED || this._timerState == TimerState.CONTINUATION){
      this.changeState(ChangeStateCause.FINISH);
    }
  }

  private startTicking(){
    this._currentCountdownID++;
    const countdownID = this._currentCountdownID;
    interval(1000).pipe(takeWhile(()=> this.shouldTicking(countdownID))).subscribe(()=>{
      this.tick();
    });
  }

  // TODO: pomyśleć, jak to powinno wyglądać
  private shouldTicking(countdownID: number){
    return (this._timerState == TimerState.TICKING
      || this._timerState == TimerState.CONTINUATION)
      && this._currentCountdownID == countdownID
  }

  private isTimerTicking():boolean{
    return this._timerState == TimerState.TICKING;
  }

  private tick(){
    switch(this._timerState){
      case TimerState.TICKING:
        this.tickNormal();
        break;
      case TimerState.CONTINUATION:
        this.tickContinuation();
        break;
    }
  }

  private tickNormal(){
    this._time--;
    this._stateTime++;
    if(this.isTickingFinished()){ // TODO: rozpatrzyć sytuacje, jeżeli to jest doliczone
        this._time = 0;
        this.finishTicking();
    } else {
      this._tickCallback(this._time);
    }
  }

  private isTickingFinished() {
    return this._time < 0;
  }

  private tickContinuation(){
    this._time++;
  }

  private finishTicking(){
    const continueState = this._settings.continueState;
    const nextState = StateInfoCreator.getNextState(this._stateInfo, this._settings);
    const runNextState = this._settings.runNextState;
    if(this.isAutomaticallyContinueState(continueState, nextState)){
      this._timerState = TimerState.CONTINUATION;
    } else if(this.isAutomaticallyRunNextState(runNextState, nextState)){
      this.changeState(ChangeStateCause.FINISH);
      this.start();
    } else {
      this.stop(); // TODO: sprawdzić, czy wszystko się będzie zgadzało
    }
  }

  private changeState(cause: ChangeStateCause){
    if(this._endCallback){
      const summary = new PomodoroStateSummary(this._stateInfo.state, this._stateTime, cause);
      this._endCallback(summary);
    }
    this._stateInfo = StateInfoCreator.getNextStateInfo(this._stateInfo, this._settings);
    this._stateTime = 0;
    this.updateTime();
    if(this._tickCallback){
      this._tickCallback(this._time);
    }
  }

  private isAutomaticallyContinueState(continueState: StateControl, nextState: State): boolean{
    return (continueState == StateControl.ALL
    || (continueState == StateControl.WORK && nextState == State.WORK)
    || (continueState == StateControl.BREAK && BreakHelper.isBreak(nextState)));
  }

  private isAutomaticallyRunNextState(runNextState: StateControl, nextState: State): boolean {
    return (runNextState == StateControl.ALL
      || (runNextState == StateControl.WORK && nextState == State.WORK)
      || (runNextState == StateControl.BREAK && BreakHelper.isBreak(nextState)));
  }

  public stop() {
    // TODO: wyświetlić komunikat, czy na pewno zatrzymać
    this._timerState = TimerState.STOPED;
    this.changeState(ChangeStateCause.STOP);
  }

  public pause() {
    this._timerState = TimerState.PAUSED;
  }

  public continue() {
    this.start();
  }

  public continueState() {
    this._timerState = TimerState.CONTINUATION;
    this._time = 0;
  }

  public skipState() {
    this.changeState(ChangeStateCause.SKIP);
  }

  public addTime(time: number) {
    this._time += time;
    if(this._timerState == TimerState.FINISHED){
      this._timerState = TimerState.TICKING;
      this.start();
    }
  }

  public isTicking():boolean{
    return this._timerState == TimerState.TICKING;
  }

  public getState(){
    return this._stateInfo.state;
  }

  public isFinished(){
    return this._timerState == TimerState.FINISHED;
  }

  public getStep(){
    return this._stateInfo.step;
  }

  private getTimeText(){
    return TimerFormatter.getTimeText(this._time, this._timerState);
  }

  public timerState(): TimerState {
    return this._timerState;
  }

  public currentStep():number{
    return this._stateInfo.step;
  }

  public currentState():State{
    return this._stateInfo.state;
  }

  public time(): number{
    return this._time;
  }

  public updateSettings(settings: PomodoroSettings){
    this._settings = settings;
    if(this._timerState == TimerState.STOPED){
      console.log("Aktualizacja czasu");
      this._time = StateInfoCreator.getNextTime(this._stateInfo.state, this._settings);
    }
  }
}


