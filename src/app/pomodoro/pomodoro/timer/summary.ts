import { State} from '../shared/state';

export class PomodoroStateSummary{

  private _state: State;
  private _time: number;

  constructor(state: State, time: number){

    this._state = state;
    this._time = time;
  }

  public get state(): State {
    return this._state;
  }

  public get time(): number {
    return this._time;
  }
}
