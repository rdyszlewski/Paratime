import { Component, OnInit } from '@angular/core';
import { CalendarDay } from '../../day-schedule/day';
import { ICalendarCallback } from './calendar-callback';
import { CalendarCreator } from './calendar-creator';

@Component({
  selector: 'app-mini-calendar',
  templateUrl: './mini-calendar.component.html',
  styleUrls: ['./mini-calendar.component.css']
})
export class MiniCalendarComponent implements OnInit {

  private _days: CalendarDay[];
  private _currentDate: Date;
  private _callbacks: ICalendarCallback;

  public get days(): CalendarDay[] {
    return this._days;
  }

  public set callbacks(value: ICalendarCallback){
    this._callbacks = value;
  }

  constructor() {
    // TODO: zarobić załadowanie kalendarza
    this._currentDate = new Date();
    this._days = CalendarCreator.create(10, 2020);
    console.log(this._days);
  }

  ngOnInit(): void {
  }

  public isCurrentDay(day: CalendarDay): boolean{
    return this._currentDate.getDate() == day.day &&
      this._currentDate.getMonth() == day.month &&
      this._currentDate.getFullYear() == day.year;
  }

  public onLeftClick(day: CalendarDay):void{
    if(this._callbacks){
      this._callbacks.onLeftClick(day);
    }
  }

  public onRightClick(day: CalendarDay): void{
    if(this._callbacks){
      this._callbacks.onRightClick(day);
    }
  }

}
