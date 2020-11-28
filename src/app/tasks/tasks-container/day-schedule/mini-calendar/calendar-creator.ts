import { CalendarDay } from '../../day-schedule/day';

// TODO: dostosować to, żeby można było tego użyć w calendar
export class CalendarCreator{

  public static create(month: number, year:number): CalendarDay[]{
    const currentDate = new Date(year,month, 1);
    const lastDayOfPreviousMonth = new Date(year, month, 0);
    const lastDayOfCurrentMonth = new Date(year, month + 1, 0);
    const cells: CalendarDay[] = [];
    this.insertCellsBefore(month, currentDate, lastDayOfPreviousMonth, cells);
    this.insertCellsCurrent(month, year, lastDayOfCurrentMonth, cells);
    this.insertCellsAfter(month, lastDayOfCurrentMonth, cells);
    return cells;
  }

  private static insertCellsBefore(month: number, currentDate: Date, previousDate: Date, cells: CalendarDay[]) {
    /// inserts dates from the previous month that are in the week that is the first day of the current month
    const firstDay = this.getDateOfWeek(currentDate);
    const previousLastDay = previousDate.getDate();
    let year = currentDate.getFullYear();
    if(month == 0){
      year -= 1;
    }
    for (let i = previousLastDay - firstDay + 1; i < previousLastDay + 1; i++) {
      cells.push(new CalendarDay(i, month - 1, year, false));
    }
  }

  private static insertCellsCurrent(month: number, year: number, lastDayOfMonth: Date, cells: CalendarDay[]) {
    /// inserts dates from the current month
    const lastDay = lastDayOfMonth.getDate();
    for (let i = 1; i < lastDay + 1; i++) {
      cells.push(new CalendarDay(i, month, year, true));
    }
  }

  private static insertCellsAfter(month: number, lastDate: Date, cells: CalendarDay[]) {
    /// inserts dates from next month, that are in the same week, that is the last day of the current month
    const lastDayNumber = this.getDateOfWeek(lastDate);
    let year = lastDate.getFullYear();
    if(month == 11){
      year+=1;
    }
    for (let i = 1; i < 7 - lastDayNumber; i++) {
      cells.push(new CalendarDay(i, month + 1, year, false));
    }

    if (cells.length != 42) {
      for (let i = 7 - lastDayNumber; i < 14 - lastDayNumber; i++) {
        cells.push(new CalendarDay(i, month + 1, year, false));
      }
    }
  }

  private static getDateOfWeek(date: Date){
    const number = date.getDay() - 1;
    return number >= 0? number : 6;
  }
}
