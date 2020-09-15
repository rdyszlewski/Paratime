import { PomodoroSettings } from '../settings/settings';
import { State, TimerState } from '../shared/state';
import { TimerSettingsController } from './settings.controller';
import { StateInfo } from './state.info';
import { PomodoroStateSummary } from './summary';
import { TickingController } from './ticking.controller';
import { IPomodoroTimer, TimerEndCallback, TimerTickCallback } from './timer';
import { TimerInfo } from './timer.info';

export class PomodoroTimer implements IPomodoroTimer {
  private _timerInfo: TimerInfo;
  private _stateInfo: StateInfo;

  private _tickCallback: TimerTickCallback;
  private _endCallback: TimerEndCallback;

  private _tickingController: TickingController;
  private _settingsController: TimerSettingsController;

  constructor(settings: PomodoroSettings, tickCallback: TimerTickCallback, endCallback: TimerEndCallback) {
    this._tickCallback = tickCallback;
    this._endCallback = endCallback;
    this._timerInfo = new TimerInfo();
    this._stateInfo = TimerSettingsController.getInitialStateInfo(settings);
    this._settingsController = new TimerSettingsController(
      settings,
      this._timerInfo,
      this._stateInfo
      );
    this._tickingController = new TickingController(
      this._timerInfo,
      this._tickCallback,
      ()=>this.finishTicking()
    );
    }

  public setTickCallback(callback: TimerTickCallback) {
    this._tickCallback = callback;
  }

  public setEndCallback(callback: TimerEndCallback) {
    this._endCallback = callback;
  }

  public start() {
    this.setupState();
    this._timerInfo.timerState = TimerState.TICKING;
    this._tickingController.startTicking();
  }

  private setupState() {
    // TODO: tutaj nie powinno być też STOP?
    if (
      this._timerInfo.timerState == TimerState.FINISHED ||
      this._timerInfo.timerState == TimerState.CONTINUATION
    ) {
      this.changeState();
    }
  }

  private finishTicking() {
    if (this._settingsController.isAutomaticallyContinueState(this._stateInfo)) {
      this._timerInfo.timerState = TimerState.CONTINUATION;
    } else if (this._settingsController.isAutomaticallyRunNextState(this._stateInfo)) {
      this.changeState();
      this.start();
    } else {
      this.stop();
    }
  }

  private changeState() {
    if (this._endCallback) {
      const summary = new PomodoroStateSummary(
        this._stateInfo.state,
        this._timerInfo.stateTime
      );
      this._endCallback(summary);
    }
    this._stateInfo = this._settingsController.setupNextState(this._stateInfo);
    if (this._tickCallback) {
      this._tickCallback(this._timerInfo.time);
    }
  }

  // TODO: sprawdzić, czy nie można tego zrobić w jakiś inny sposób
  public getSummary(): PomodoroStateSummary {
    return new PomodoroStateSummary(
      this._stateInfo.state,
      this._timerInfo.stateTime
    );
  }

  public resetStateTime(): void {
    this._timerInfo.stateTime = 0;
  }

  public stop() {
    // TODO: wyświetlić komunikat, czy na pewno zatrzymać
    this._timerInfo.timerState = TimerState.STOPED;
    this.changeState();
  }

  public pause() {
    this._timerInfo.timerState = TimerState.PAUSED;
  }

  public resume() {
    this.start();
  }

  public continueState() {
    this._timerInfo.timerState = TimerState.CONTINUATION;
    this._timerInfo.time = 0;
  }

  public skipState() {
    this.changeState();
  }

  public addTime(time: number) {
    this._timerInfo.time += time;
    if (this._timerInfo.timerState == TimerState.FINISHED) {
      this._timerInfo.timerState = TimerState.TICKING;
      this.start();
    }
  }

  public isTicking(): boolean {
    return (
      this._timerInfo.timerState == TimerState.TICKING ||
      this._timerInfo.timerState == TimerState.CONTINUATION
    );
  }

  public getState() {
    return this._stateInfo.state;
  }

  public isFinished() {
    return this._timerInfo.timerState == TimerState.FINISHED;
  }

  public getStep() {
    return this._stateInfo.step;
  }

  public timerState(): TimerState {
    return this._timerInfo.timerState;
  }

  public currentStep(): number {
    return this._stateInfo.step;
  }

  public currentState(): State {
    return this._stateInfo.state;
  }

  public time(): number {
    return this._timerInfo.time;
  }

  public updateSettings(settings: PomodoroSettings) {
    this._settingsController.setSettings(settings, this._stateInfo);
  }
}
