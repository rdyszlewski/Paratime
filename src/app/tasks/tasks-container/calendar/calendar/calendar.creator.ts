import { TaskDay } from '../task.day';

export class CalendarCreator{

  public static createCalendar(month: number, year:number): TaskDay[]{
    const date = new Date(year,month, 1);
    const previousDate = new Date(year, month, 0);
    const lastDate = new Date(year, month + 1, 0);
    const cells = [];
    this.insertCellsBefore(month, date, previousDate, cells);
    this.insertCellsCurrent(month, lastDate, cells);
    this.insertCellsAfter(month, lastDate, cells);
    return cells;
  }

  private static insertCellsBefore( month: number, date: Date,previousDate: Date, cells: TaskDay[]) {
    const firstDay = this.getDateOfWeek(date);
    const previousLastDay = previousDate.getDate();
    for (let i = previousLastDay - firstDay + 1; i < previousLastDay + 1; i++) {
      cells.push(new TaskDay(i, month - 1, false));
    }
  }

  private static insertCellsCurrent(month: number, lastDate: Date, cells: TaskDay[]) {
    const lastDay = lastDate.getDate();
    for (let i = 1; i < lastDay + 1; i++) {
      cells.push(new TaskDay(i, month, true));
    }
  }

  private static insertCellsAfter(month: number, lastDate: Date, cells: TaskDay[]) {
    const lastDayNumber = this.getDateOfWeek(lastDate);
    for (let i = 1; i < 7 - lastDayNumber; i++) {
      cells.push(new TaskDay(i, month + 1, false));
    }

    if (cells.length != 42) {
      for (let i = 7 - lastDayNumber; i < 14 - lastDayNumber; i++) {
        cells.push(new TaskDay(i, month + 1, false));
      }
    }
  }

  private static getDateOfWeek(date: Date){
    const number = date.getDay() - 1;
    return number >= 0? number : 6;
  }
}
