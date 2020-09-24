export interface ICalendarDate{
  increaseMonth();
  decreaseMonth();
  increaseYear();
  decreaseYear();
  month;
  year;
  setCurrentDate();
}

type UpdateCalendarEvent = ()=>void;

export class DateModel implements ICalendarDate{

  private _month: number;
  private _year: number;
  private _updateCalendarEvent: UpdateCalendarEvent;

  constructor(updateCalendarEvent: UpdateCalendarEvent){
    this._updateCalendarEvent = updateCalendarEvent;
    this.init(new Date());
  }

  private init(date: Date){
    this._month = date.getMonth();
    this._year = date.getFullYear();
  }

  public increaseMonth() {
    this._month += 1;
    if (this._month > 11) {
      this._month = 0;
      this._year += 1;
    }
    this.updateCalendar();
  }

  public decreaseMonth() {
    this._month -= 1;
    if (this._month < 0) {
      this._month = 11;
      this._year -= 1;
    }
    this.updateCalendar();
  }

  public increaseYear() {
    this._year += 1;
    this.updateCalendar();
  }

  public decreaseYear() {
    this._year -= 1;
    this.updateCalendar();
  }

  private updateCalendar(){
    if(this._updateCalendarEvent){
      this._updateCalendarEvent();
    }
  }

  public get month() {
    return this._month;
  }

  public get year() {
    return this._year;
  }

  public setCurrentDate() {
    this.init(new Date());
    this.updateCalendar();
  }
}
