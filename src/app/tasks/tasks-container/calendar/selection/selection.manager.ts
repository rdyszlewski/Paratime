import { Task } from 'app/database/shared/task/task';
import { TaskSelectionBase } from './selection.base';

export class TaskSelection extends TaskSelectionBase{

  private _currentDate: Date;

  protected handleAddingTask(task: Task) {
    if(!this.isSameDate(this._currentDate, task.date())){
      this.deselectAll();
    }
    this._currentDate = task.date();
  }

  private isSameDate(currentDate: Date, taskDate: Date){
    if(currentDate == null && taskDate == null){
      return true;
    }
    if(currentDate == null || taskDate == null){
      return false;
    }
    return currentDate.getDay() == taskDate.getDay()
    && currentDate.getMonth() == taskDate.getMonth()
    && currentDate.getFullYear() == taskDate.getFullYear()
  }

  public getSelectedTasks(originalOrder: Task[]): Task[] {
    if(originalOrder == null){
      return this._selectedTasks;
    } else {
      return this.orderSelectedTasks(originalOrder);
    }
  }

  private orderSelectedTasks(orignalOrder: Task[]): Task[]{
    return orignalOrder.filter(x=>this._selectedIds.has(x.getId()));
  }
}
