export class CalendarDay{

  private _day: number;
  private _month: number;
  private _year; number;
  private _active: boolean;

  constructor(day: number, month: number, year: number, active:boolean = true){
    this._day = day;
    this._month = month;
    this._year = year;
    this._active = active;
  }

  public get day(): number{
    return this._day;
  }

  public get month(): number{
    return this._month;
  }

  public get year(): number{
    return this._year;
  }

  public get active(): boolean{
    return this._active;
  }

  public set active(value:boolean){
    this._active = value;
  }

}
