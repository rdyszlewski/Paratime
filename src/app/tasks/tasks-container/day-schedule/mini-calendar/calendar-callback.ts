import { CalendarDay } from '../day';

export interface ICalendarCallback{

  onLeftClick(day: CalendarDay);
  onRightClick(day: CalendarDay);

}
