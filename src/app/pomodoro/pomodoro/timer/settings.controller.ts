import { PomodoroSettings, StateControl } from '../settings/settings';
import { State, BreakHelper, TimerState } from '../shared/state';
import { StateInfo } from './state.info';
import { StateInfoCreator } from './state.info.creator';
import { TimerInfo } from './timer.info';

export class TimerSettingsController{

  private _settings: PomodoroSettings;
  private _timerInfo: TimerInfo;

  constructor(settings: PomodoroSettings, timerInfo: TimerInfo, stateInfo: StateInfo){
    this._timerInfo = timerInfo;
    this.setSettings(settings, stateInfo);
  }

  public setSettings(settings: PomodoroSettings, stateInfo: StateInfo){
    this._settings = settings;
    if(this._timerInfo.timerState == TimerState.STOPED){
      this.updateTime(stateInfo, true);
    }
  }

  public updateTime(stateInfo: StateInfo, newState: boolean = true){
    this._timerInfo.time = stateInfo.time;
    if(newState){
      this._timerInfo.stateTime = 0;
    }
  }

  public isAutomaticallyContinueState(currentState: StateInfo): boolean{
    const continueState = this._settings.continueState;
    const nextState = StateInfoCreator.getNextState(currentState, this._settings);
    return (continueState == StateControl.ALL
    || (continueState == StateControl.WORK && nextState == State.WORK)
    || (continueState == StateControl.BREAK && BreakHelper.isBreak(nextState)));
  }

  public isAutomaticallyRunNextState(currentState: StateInfo): boolean {
    const runNextState = this._settings.runNextState;
    const nextState = StateInfoCreator.getNextState(currentState, this._settings);
    return (runNextState == StateControl.ALL
      || (runNextState == StateControl.WORK && nextState == State.WORK)
      || (runNextState == StateControl.BREAK && BreakHelper.isBreak(nextState)));
  }

  public setupNextState(stateInfo: StateInfo){
    const newStateInfo = this.getNextStateInfo(stateInfo);
    this.updateTime(newStateInfo, true);
    return newStateInfo;
  }

  private getNextStateInfo(stateInfo: StateInfo){
    return StateInfoCreator.getNextStateInfo(stateInfo, this._settings);
  }

  public static getInitialStateInfo(settings: PomodoroSettings){
    return StateInfoCreator.getInitialStateInfo(settings);
  }
}
