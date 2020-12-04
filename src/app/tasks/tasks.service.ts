import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from 'app/core/services/app/app.service';
import { DataService } from 'app/data.service';
import { KanbanColumn, KanbanTask } from 'app/database/data/models/kanban';
import { Project } from 'app/database/data/models/project';
import { Status } from 'app/database/data/models/status';
import { Task } from 'app/database/data/models/task';
import { ITaskItem } from 'app/database/data/models/task.item';
import { TaskInsertData } from 'app/database/model/task.insert-data';
import { TaskInsertResult } from 'app/database/model/task.insert-result';
import { DialogHelper } from 'app/shared/common/dialog';
import { EventBus } from 'eventbus-ts';
import { TaskDetailsEvent } from './tasks-container/events/details.event';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private dialog: MatDialog, private appService: AppService, private dataService: DataService) { }

  public removeTask(task: ITaskItem): Promise<ITaskItem[]>{
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

  private removeTaskFromDatabase(task: ITaskItem):Promise<ITaskItem[]>{
    if(task instanceof Task){
      return this.dataService.getTaskService().remove(task);
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
    return this.dataService.getTaskService().changeStatus(task, Status.ENDED).then(updatedTasks=>{
      if(this.appService.getCurrentTask() == task){
        this.appService.setCurrentTask(null);
      }
      return Promise.resolve(updatedTasks);
    });
  }

  public addTask(name:string, project:Project = null, column: KanbanColumn=null, date: Date = null):Promise<TaskInsertResult>{
    const task = this.prepareTaskToInsert(name, project, date);
    let data = new TaskInsertData(task, column, project.getId());
    return this.dataService.getTaskService().create(data);
  }

  private prepareTaskToInsert(name: string, project: Project = null, date:Date=null){
    const task = new Task();
    task.setName(name);
    task.setProject(project as Project);
    task.setDate(date);
    task.setStatus(Status.STARTED);
    return task;
  }
}
