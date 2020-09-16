import { Task } from 'app/database/data/models/task';

export class TaskDay{

  private _day: number;
  private _month: number;

  private _active: boolean;
  private _tasks: Task[] = [];

  constructor(number: number, month: number, active: boolean = true){
    this._day = number;
    this._month = month;
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
}
