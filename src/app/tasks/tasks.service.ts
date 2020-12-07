import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from 'app/core/services/app/app.service';
import { DataService } from 'app/data.service';
import { Task } from 'app/database/shared/task/task';
import { ITaskItem } from 'app/database/shared/task/task.item';
import { TaskRemoveResult } from 'app/database/shared/task/task.remove-result';
import { DialogHelper } from 'app/shared/common/dialog';
import { EventBus } from 'eventbus-ts';
import { TaskDetailsEvent } from './tasks-container/events/details.event';
import { KanbanTask } from 'app/database/shared/kanban-task/kanban-task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private dialog: MatDialog, private appService: AppService, private dataService: DataService) { }

  // TODO: cholera, to będzie trzeba trochę zmienić
  public removeTask(task: ITaskItem): Promise<TaskRemoveResult>{
    // TODO: to powinno być zrobione jakoś inaczej. Pytanie raczej powinno postawić się w innym miejscu
    return this.showMessage(task).then(answer=>{
      if(answer){
        return this.removeTaskFromDatabase(task);
      }
      return Promise.resolve(null);
    });
  }

  private showMessage(task: ITaskItem):Promise<boolean>{
    const message = "Czy na pewno usunąć zadanie: '" + task.getName() +"'?";
    return DialogHelper.openDialog(message, this.dialog).toPromise();
  }

  private removeTaskFromDatabase(task: ITaskItem):Promise<TaskRemoveResult>{
    if(task instanceof Task){
      return this.dataService.getTaskService().remove(task);
    } else if (task instanceof KanbanTask){
      return this.dataService.getKanbanTaskService().remove(task.getTask());
    }
  }

  public removeManyTasks(tasks: ITaskItem[]):Promise<ITaskItem[]>{
    return this.showMessageMany(tasks).then(answer=>{
      if(answer){
        const promises = tasks.map(x=>this.removeTaskFromDatabase(x));
        // TODO: sprawdzić, czy to będzie poprawnie działać
        return Promise.all(promises).then(results=>{
          return Promise.resolve([].concat.apply([], results));
        });
      }
    })
  }

  private showMessageMany(tasks: ITaskItem[]): Promise<boolean>{
    const message = "Czy na pewno usunąć " + tasks.length + " zadania?";
    return DialogHelper.openDialog(message, this.dialog).toPromise();
  }

  public openDetails(task: ITaskItem): void {
    EventBus.getDefault().post(new TaskDetailsEvent(task as Task));
  }
}
