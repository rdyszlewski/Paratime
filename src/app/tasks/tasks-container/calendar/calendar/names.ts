import { ICalendarTasks } from '../models/tasks.model';
import { TaskDay } from '../task.day';
import { CalendarValues } from '../values';

export class DropIdsCreator{

  private _tasksModel: ICalendarTasks;

  constructor(tasksModel: ICalendarTasks){
    this._tasksModel = tasksModel;
  }

  public getCellId(cell: TaskDay) {
    return 'cell_' + cell.day + '_' + cell.month + "_" + cell.year;
  }

  public getDayId(cell:TaskDay){
    return 'day_' + cell.day + '_' + cell.month + "_" + cell.year;
  }

  public getCellIds() {
    const cellNames = [];
    this._tasksModel.cells.forEach((x) => {
      cellNames.push(this.getCellId(x));
    });
    cellNames.push(CalendarValues.WITHOUT_DATE);
    cellNames.push(CalendarValues.CURRENT_TASKS);
    return cellNames;
  }

  public getDayIds(){
    return this._tasksModel.cells.map(x=>this.getDayId(x));
  }

}
