import { Task } from 'app/database/data/models/task';

export class TaskDay{

  private _day: number;
  private _month: number;
  private _year: number;

  private _active: boolean;
  private _tasks: Task[] = [];

  constructor(day: number, month: number, year:number, active: boolean = true){
    this._day = day;
    this._month = month;
    this._year = year;
    this._active = active;
  }
  // TODO: wstawić zadania i takie tam

  public get day(): number {
    return this._day;
  }
  public set day(value: number) {
    this._day = value;
  }

  public get month(): number {
    return this._month;
  }
  public set month(value: number) {
    this._month = value;
  }

  public get active(): boolean {
    return this._active;
  }
  public set active(value: boolean) {
    this._active = value;
  }

  public get tasks(): Task[] {
    return this._tasks;
  }
  public set tasks(value: Task[]) {
    this._tasks = value;
  }

  public get year(): number {
    return this._year;
  }
  public set year(value: number) {
    this._year = value;
  }
}
