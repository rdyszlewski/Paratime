import { State } from "./state";
import { PomodoroSettings } from "../settings/settings"

export class StateInfo{

  private _state: State;
  private _time: number;
  private _interval: number;
  private _step: number;

  public get state(): State {
    return this._state;
  }
  public set state(value: State) {
    this._state = value;
  }

  public get time(): number {
    return this._time;
  }
  public set time(value: number) {
    this._time = value;
  }

  public get interval(): number {
    return this._interval;
  }
  public set interval(value: number) {
    this._interval = value;
  }

  public get step(): number {
    return this._step;
  }
  public set step(value: number) {
    this._step = value;
  }
  // TODO: być może dołożyć tutaj aktualny interwał czy coś

}

