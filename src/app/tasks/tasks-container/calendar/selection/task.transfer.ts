import { Task } from 'app/database/shared/task/task';
import { ICalendarTasks } from '../models/tasks.model';

export class ManyTaskTransfer{

  private _tasksModel: ICalendarTasks;

  constructor(tasksModel: ICalendarTasks = null){
    this._tasksModel = tasksModel;
  }

  public init(tasksModel: ICalendarTasks){
    this._tasksModel = tasksModel;
  }

  public transferItems(currentList: Task[], currentIndex: number, items: Task[]){
    let counter = 0;
    items.forEach(item=>{
      const previousList = this.findTasksWithDate(item.date);
      this.removeItem(previousList, item);
      this.insertItem(currentList, currentIndex, counter, item);
      counter++;
    });
  }

  private insertItem(currentList: Task[], currentIndex: number, counter: number, item: Task) {
    currentList.splice(currentIndex + counter, 0, item);
  }

  private removeItem(previousList: Task[], item: Task) {
    const index = previousList.indexOf(item);
    previousList.splice(index, 1);
  }

  private findTasksWithDate(date: Date): Task[]{
    if(date == null){
      return this._tasksModel.tasksWithoutDate;
    }
    const cell = this._tasksModel.findCell(date);
    if(cell){
      return cell.tasks;
    }
    return [];
  }
}
