import { Component, OnInit } from "@angular/core";
import { CalendarDay } from "../../day-schedule/day";
import { ICalendarCallback } from "./calendar-callback";
import { CalendarCreator } from "./calendar-creator";

@Component({
  selector: "app-mini-calendar",
  templateUrl: "./mini-calendar.component.html",
  styleUrls: ["./mini-calendar.component.less"],
})
export class MiniCalendarComponent implements OnInit {
  private _month: number;
  private _year: number;
  private _days: CalendarDay[];
  private _currentDate: Date;
  private _callbacks: ICalendarCallback;

  public get days(): CalendarDay[] {
    return this._days;
  }

  public set callbacks(value: ICalendarCallback) {
    this._callbacks = value;
  }

  constructor() {
    this._currentDate = new Date();
    this._month = this._currentDate.getMonth();
    this._year = this._currentDate.getFullYear();
    this._days = CalendarCreator.create(this._month, this._year);
  }

  ngOnInit(): void {}

  public isCurrentDay(day: CalendarDay): boolean {
    return (
      this._currentDate.getDate() == day.day &&
      this._currentDate.getMonth() == day.month &&
      this._currentDate.getFullYear() == day.year
    );
  }

  public onLeftClick(day: CalendarDay): void {
    if (this._callbacks) {
      this._callbacks.onLeftClick(day);
    }
  }

  public onRightClick(day: CalendarDay): void {
    if (this._callbacks) {
      this._callbacks.onRightClick(day);
    }
  }

  public getMonthValue() {
    return this._month + 1 + "." + this._year;
  }

  public increaseMonth() {
    this._month++;
    if (this._month == 12) {
      this._month = 0;
      this._year++;
    }
    this._days = CalendarCreator.create(this._month, this._year);
  }

  public decreaseMonth() {
    this._month--;
    if (this._month < 0) {
      this._month = 11;
      this._year--;
    }
    this._days = CalendarCreator.create(this._month, this._year);
  }
}
