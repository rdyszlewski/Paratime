import { TaskDay } from '../task.day';

export interface ICalendarView{
  // TODO: popracować nad nazwami
  isShowingWithoutDate():boolean;
  isShowingCurrentTasks():boolean;
  selectedDay:TaskDay;
  toggleShowingWithoutDate():void;
  toggleShowingCurrentTasks(): void;
  selectDay(day: TaskDay): void;
  isSelected(dayTask: TaskDay):boolean;
  getSelectedDate(): string;
}

export class ViewModel implements ICalendarView{

  private _showingTasksWithoutDate: boolean;
  private _showingCurrentsTasks: boolean;
  private _currentDay: TaskDay;
  private _selectedDay: TaskDay;

  public isShowingWithoutDate():boolean {
    return this._showingTasksWithoutDate;
  }

  public isShowingCurrentTasks():boolean {
    return this._showingCurrentsTasks;
  }

  public get selectedDay(): TaskDay{
    return this._selectedDay;
  }

  public set selectedDay(value: TaskDay){
    this._currentDay = value;
  }

  public toggleShowingWithoutDate(): void {
    this._showingTasksWithoutDate = !this._showingTasksWithoutDate;
  }

  public toggleShowingCurrentTasks(): void {
    this._showingCurrentsTasks = !this._showingCurrentsTasks;
  }

  public selectDay(day: TaskDay): void {
    this._selectedDay = day;
  }

  public isSelected(day: TaskDay):boolean{
    return this._selectedDay == day;
  }

  public getSelectedDate(): string {
    if(this._selectedDay){
      return this._selectedDay.day + "." +this._selectedDay.month;
    }
    return "";
  }
    // TODO: pomyśleć, jak powinno się zrobić w przypadku zaznaczonego elementu
}

