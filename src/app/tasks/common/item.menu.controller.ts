import { Task } from 'app/models/task';
import { TasksModel } from '../model';
import { EventEmitter } from '@angular/core';
import { DialogHelper } from 'app/common/dialog';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'app/data.service';
import { Status } from 'app/models/status';

export class ItemMenuController{

  private detailsEvent: EventEmitter<Task>;
  private removeEvent: EventEmitter<number>;
  private pomodoroEvent: EventEmitter<Task>;
  private dialog: MatDialog;
  private model: TasksModel;

  constructor(model:TasksModel, detailsEvent:EventEmitter<Task>, removeEvent:EventEmitter<number>, pomodoroEvent:EventEmitter<Task>, dialog: MatDialog){
    this.model = model;
    this.detailsEvent = detailsEvent;
    this.removeEvent = removeEvent;
    this.pomodoroEvent = pomodoroEvent;
    this.dialog = dialog;
  }

  public onTaskMenuClick(mouseEvent: MouseEvent, task:Task){
    mouseEvent.stopPropagation();
    this.model.setTaskWithOpenMenu(task);
    // TODO: wymyślić, w jakis sposbó zaznaczyć element
  }

  public onEditTask(task:Task){
    this.detailsEvent.emit(task);
    this.model.setTaskWithOpenMenu(null);
  }

  public onRemoveTask(task:Task){
    const message = "Czy na pewno usunąć zadanie?";
    DialogHelper.openDialog(message, this.dialog).subscribe(result=>{
      if(result){
        this.removeTask(task);
      }
    });
  }

  private removeTask(task:Task):void{
    DataService.getStoreManager().getTaskStore().removeTask(task.getId()).then(updatedTasks=>{
      this.model.removeTask(task);
      this.model.updateTasks(updatedTasks);
      this.removeEvent.emit(task.getId());
    });
  }

  public addTaskToPomodoro(task:Task){
    this.pomodoroEvent.emit(task);
  }

  public finishTask(task:Task){
    DataService.getStoreManager().getTaskStore().changeStatus(task, Status.ENDED).then(updatedTasks=>{
      this.model.removeTask(task);
      this.model.updateTasks(updatedTasks);
    })
  }
}
