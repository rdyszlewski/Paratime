import { TimerState } from '../shared/state';

export class TimerInfo {
  private _time: number = 0;
  private _stateTime: number = 0;
  private _timerState: TimerState = TimerState.STOPED;

  public get time(): number {
    return this._time;
  }
  public set time(value: number) {
    this._time = value;
  }

  public get stateTime(): number {
    return this._stateTime;
  }
  public set stateTime(value: number) {
    this._stateTime = value;
  }

  public get timerState(): TimerState {
    return this._timerState;
  }
  public set timerState(value: TimerState) {
    this._timerState = value;
  }
}
