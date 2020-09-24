import { Task } from 'app/database/data/models/task';
import { TaskDay } from '../task.day';

export interface ICalendarTasks{
  cells;
  tasksWithoutDate;
  clearTasks();
  findCell(date:Date): TaskDay;
}

export class TasksModel implements ICalendarTasks{

  private _cells: TaskDay[];
  private _tasksWithoutDate: Task[];

  public get cells(): TaskDay[] {
    return this._cells;
  }
  public set cells(value: TaskDay[]) {
    this._cells = value;
  }

  public get tasksWithoutDate(): Task[] {
    return this._tasksWithoutDate;
  }
  public set tasksWithoutDate(value: Task[]) {
    this._tasksWithoutDate = value;
  }

  public clearTasks() {
    this._cells.forEach(x=>x.tasks = []);
  }

  public findCell(date:Date): TaskDay{
    return this._cells.find(x=>x.day == date.getDate()
      && x.month == date.getMonth()
      && x.year == date.getFullYear());
  }

  // TODO: dodać, jeżeli coś będzie jeszcze potrzebne
}
