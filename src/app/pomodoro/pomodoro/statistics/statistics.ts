import { State } from '../shared/state';

export class PomodoroStatistics{

  private _state: State;
  private _time: number;

  private _date: Date = null;


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

  public get date(): Date {
    return this._date;
  }
  public set date(value: Date) {
    this._date = value;
  }
}
