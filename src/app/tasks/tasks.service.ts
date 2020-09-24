import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from 'app/core/services/app/app.service';
import { DataService } from 'app/data.service';
import { InsertTaskData } from 'app/database/data/common/models/insert.task.data';
import { InsertTaskResult } from 'app/database/data/common/models/insert.task.result';
import { KanbanColumn, KanbanTask } from 'app/database/data/models/kanban';
import { Project } from 'app/database/data/models/project';
import { Status } from 'app/database/data/models/status';
import { Task } from 'app/database/data/models/task';
import { ITaskItem } from 'app/database/data/models/task.item';
import { DialogHelper } from 'app/shared/common/dialog';
import { EventBus } from 'eventbus-ts';
import { TaskDetailsEvent } from './tasks-container/events/details.event';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private dialog: MatDialog, private appService: AppService) { }

  public removeTask(task: ITaskItem): Promise<ITaskItem[]>{
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

  private removeTaskFromDatabase(task: ITaskItem):Promise<ITaskItem[]>{
    if(task instanceof Task){
      return DataService.getStoreManager().getTaskStore().removeTask(task.getId());
    } else if (task instanceof KanbanTask){
      return DataService.getStoreManager().getKanbanTaskStore().removeTask(task.getId());
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

  public finishTask(task: Task): Promise<Task[]>{
    return DataService.getStoreManager().getTaskStore().changeStatus(task, Status.ENDED).then(updatedTasks=>{
      if(this.appService.getCurrentTask() == task){
        this.appService.setCurrentTask(null);
      }
      return Promise.resolve(updatedTasks);
    })
  }

  public addTask(name:string, project:Project = null, column: KanbanColumn=null, date: Date = null):Promise<InsertTaskResult>{
    const task = this.prepareTaskToInsert(name, project, date);
    const data = new InsertTaskData(task, column, project.getId());
    return DataService.getStoreManager().getTaskStore().createTask(data);
  }

  private prepareTaskToInsert(name: string, project: Project = null, date:Date=null){
    const task = new Task();
    task.setName(name);
    task.setProject(project as Project);
    task.setDate(date);
    return task;
  }
}
