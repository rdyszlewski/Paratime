import { State } from '../timer/state';

export class PomodoroSummary{

  private _state: State;
  private _time: number;
  private _taskId: number;
  private _projectId: number;
  private _labelsIds: number[];
  private _startDate: Date;
  private _finishDate: Date;

  private _saveSummary: boolean;

  constructor(state: State, time: number){
    this._state = state;
    this._time = time;
  }
  // TODO: zastanowić się, czy coś jeszcze chcemy zapisywać

  public get state(): State {
    return this._state;
  }

  public get time(): number {
    return this._time;
  }

  public get taskId(): number {
    return this._taskId;
  }
  public set taskId(value: number) {
    this._taskId = value;
  }

  public get projectId(): number {
    return this._projectId;
  }
  public set projectId(value: number) {
    this._projectId = value;
  }

  public get labelsIds(): number[] {
    return this._labelsIds;
  }
  public set labelsIds(value: number[]) {
    this._labelsIds = value;
  }

  public get startDate(): Date {
    return this._startDate;
  }
  public set startDate(value: Date) {
    this._startDate = value;
  }

  public get finishDate(): Date {
    return this._finishDate;
  }
  public set finishDate(value: Date) {
    this._finishDate = value;
  }

  public get saveSummary():boolean{
    return this._saveSummary;
  }

  public set saveSummary(save: boolean){
    this._saveSummary = save;
  }
}
