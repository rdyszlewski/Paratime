import { TaskContainer } from './task-container';

export class Hour{
  private _hour: number;
  private _minutes: number;
  private _mainHour: boolean;
  private _selected: boolean;
  private _lastHour: boolean;
  private _middleHour: boolean;
  private _height: number;

  // private _task: Task;
  private _tasks: TaskContainer[] = [];

  // TODO: tutaj można wstawić zadania
  public get time(){
    return this._hour + ":" + this.formatMinutes(this._minutes);
  }

  public equal(hour: number, minutes: number){
    return this._hour == hour && this._minutes == minutes;
  }

  public get mainHour():boolean{
    return this._mainHour;
  }

  public get selected(): boolean{
    return this._selected;
  }

  public set selected(value: boolean){
    this._selected = value;
  }

  public get lastHour():boolean{
    return this._lastHour;
  }

  public get height():number{
    return this._height;
  }

  public get middleHour():boolean{
    return this._middleHour;
  }

  public set height(value: number){
    this._height = value;
  }
  public get tasks(): TaskContainer[]{
    return this._tasks;
  }

  public addTask(value: TaskContainer){
    this._tasks.push(value);
  }

  public removeTask(value: TaskContainer){
    this._tasks = this._tasks.filter(x=>x!=value);
  }

  constructor(hour: number, minutes: number, mainHour: boolean = true, lastHour=false, middleHour=false){
    this._hour = hour;
    this._minutes = minutes;
    this._mainHour = mainHour;
    this._lastHour = lastHour;
    this._middleHour = middleHour;
  }

  private formatMinutes(minutes: number){
    return String(minutes).padStart(2, '0')
  }

}
