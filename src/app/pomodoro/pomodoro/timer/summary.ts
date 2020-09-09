import { State } from './state';
import { ChangeStateCause } from './timer';

export class PomodoroStateSummary{

  private _state: State;
  private _time: number;
  private _finishCause: ChangeStateCause;

  constructor(state: State, time: number, cause: ChangeStateCause){
    this._state = state;
    this._time = time;
    this._finishCause = cause;
  }

  public get state(): State {
    return this._state;
  }

  public get time(): number {
    return this._time;
  }

  public get finishCause(): ChangeStateCause {
    return this._finishCause;
  }

}
