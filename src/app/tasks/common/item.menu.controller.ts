import { Task } from 'app/models/task';
import { TasksModel } from '../model';
import { EventEmitter } from '@angular/core';
import { DialogHelper } from 'app/common/dialog';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'app/data.service';

export class ItemMenuController{
    
    private detailsEvent: EventEmitter<Task>;
    private removeEvent: EventEmitter<number>;
    private dialog: MatDialog;
    private model: TasksModel;
    // TODO: można zrobić model, który będzie obsługiwał zaznaczone elementy

    constructor(model:TasksModel, detailsEvent:EventEmitter<Task>, removeEvent:EventEmitter<number>, dialog: MatDialog){
        this.model = model;
        this.detailsEvent = detailsEvent;
        this.removeEvent = removeEvent;
        this.dialog = dialog;
    }

    public onTaskMenuClick(mouseEvent: MouseEvent, task:Task){
        mouseEvent.stopPropagation();
        this.model.setTaskWithOpenMenu(task);
        // TODO: wymyślić, w jakis sposbó zaznaczyć element 
      }
    
    
      public onEditTask(task:Task){
        // TODO: można spróbować pobrać z bazy i przekazać dalej. Może rozwiązać problem pracy na jednym obiekcie
        // this.detailsEvent.emit(this.model.getTaskWithOpenMenu());
        this.detailsEvent.emit(task);
        this.model.setTaskWithOpenMenu(null);
      }
    
      public onRemoveTask(){
        const message = "Czy na pewno usunąć zadanie?";
        DialogHelper.openDialog(message, this.dialog).subscribe(result=>{
          if(result){
            this.removeTask();
          }
        });
      }
    
      private removeTask():void{
        const taskId = this.model.getTaskWithOpenMenu().getId();
        DataService.getStoreManager().getTaskStore().removeTask(taskId).then(()=>{
          this.model.removeTask(this.model.getTaskWithOpenMenu());
          this.removeEvent.emit(taskId);
          this.model.setTaskWithOpenMenu(null);
        });
      }
}