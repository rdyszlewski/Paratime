import { Task } from 'app/database/shared/task/task';
import { TaskRemoveResult } from 'app/database/shared/task/task.remove-result';
import { ListHelper } from 'app/shared/common/lists/list.helper';
import { ICalendarTasks } from 'app/tasks/tasks-container/calendar/models/tasks.model';
import { ICalendarView } from 'app/tasks/tasks-container/calendar/models/view.model';
import { TaskDay } from 'app/tasks/tasks-container/calendar/task.day';
import { IRemoveTaskCallback } from './callback.remove-task';

export class RemoveCalendarTaskCallback implements IRemoveTaskCallback{
  // TODO: prawdopodobnie tę klasę lepiej będzie przenieść do folderu z komponentami
  constructor(private tasksModel: ICalendarTasks, private viewModel: ICalendarView, private removedTasks: Task[]=null){

  }


  public execute(results: TaskRemoveResult[]){
    if(this.removedTasks!=null){
      this.removedTasks.forEach(task=>this.removeTaskFromDay(task));
    }
    // TODO: cholera, usuwanie pojedyńczego zadania mogło wyglądać trochę inaczej
  }

  private removeTaskFromDay(task: Task) {
    if (task.getDate() != null) {
      const cell = this.tasksModel.findCell(task.getDate());
      if (cell) {
        ListHelper.remove(task, cell.tasks);
      } else {
        const selectedDay = this.viewModel.selectedDay;
        if (selectedDay && this.isCorrectCell(selectedDay, task.getDate())) {
          ListHelper.remove(task, selectedDay.tasks);
        }
      }
    } else {
      ListHelper.remove(task, this.tasksModel.tasksWithoutDate);
    }
  }


  private isCorrectCell(day: TaskDay, date: Date): boolean {
    return day.month == date.getMonth() && day.day == date.getDate() && day.year == date.getFullYear();
  }

  unExecute() {
    throw new Error('Method not implemented.');
  }
}
