import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from 'app/core/services/app/app.service';
import { DataService } from 'app/data.service';
import { KanbanTask } from 'app/database/data/models/kanban';
import { Status } from 'app/database/data/models/status';
import { Task } from 'app/database/data/models/task';
import { ITaskContainer } from 'app/database/data/models/task.container';
import { ITaskItem } from 'app/database/data/models/task.item';
import { DialogHelper } from 'app/shared/common/dialog';
import { EventBus } from 'eventbus-ts';
import { TaskDetailsEvent } from './tasks-container/events/details.event';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  // TODO: wstawić tutaj wszystkie działania na zadaniach
  constructor(private dialog: MatDialog, private appService: AppService) { }

  public removeTask(task: ITaskItem): Promise<ITaskItem[]>{
    return this.showMessage(task).then(result=>{
      if(result){
        return this.removeTaskFromDatabase(task);
      }
      return Promise.resolve(null);
    });
  }

  private showMessage(task: ITaskItem):Promise<boolean>{
    const message = "Czy na pewno usunąć zadanie: '" + task.getName() +"'?";
    return DialogHelper.openDialog(message, this.dialog).toPromise();
  }

  private removeTaskFromDatabase(task: ITaskItem):Promise<ITaskItem[]>{
    if(task instanceof Task){
      return DataService.getStoreManager().getTaskStore().removeTask(task.getId());
    } else if (task instanceof KanbanTask){
      return DataService.getStoreManager().getKanbanTaskStore().removeTask(task.getId());
    }
  }

  public openDetails(task: ITaskItem): void {
    EventBus.getDefault().post(new TaskDetailsEvent(task as Task));
  }

  addTask(container: ITaskContainer): void;

  addTask(task: ITaskItem, container: ITaskContainer): void;

  addTask(task: any, container?: any) {
    throw new Error('Method not implemented.');
  }

  public finishTask(task: Task): Promise<Task[]>{
    return DataService.getStoreManager().getTaskStore().changeStatus(task, Status.ENDED).then(updatedTasks=>{
      if(this.appService.getCurrentTask() == task){
        this.appService.setCurrentTask(null);
      }
      return Promise.resolve(updatedTasks);
    })
  }


}
