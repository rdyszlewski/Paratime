import { Task } from 'app/database/data/models/task';
import { TaskDay } from '../task.day';

export class ManyTaskTransfer{

  private _cells: TaskDay[];
  private _tasksWithoutDate: Task[];

  constructor(cells: TaskDay[]=null, tasksWithoutDate: Task[]=null){
    this._cells = cells;
    this._tasksWithoutDate = tasksWithoutDate;
  }

  public init(cells: TaskDay[], tasksWithoutDate: Task[]){
    this._cells =cells;
    this._tasksWithoutDate = tasksWithoutDate;
  }

  public transferItems(currentList: Task[], currentIndex: number, items: Task[]){
    let counter = 0;
    items.forEach(item=>{
      const previousList = this.findTasksWithDate(item.getDate());
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
      return this._tasksWithoutDate;
    }
    const cell = this._cells.find(x=>x.day == date.getDate() && x.month == date.getMonth() && x.year == date.getFullYear());
    if(cell){
      return cell.tasks;
    }
    return [];
  }
}
