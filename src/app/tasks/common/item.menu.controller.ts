import { Task } from 'app/models/task';
import { TasksModel } from '../model';
import { EventEmitter } from '@angular/core';
import { DialogHelper } from 'app/common/dialog';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'app/data.service';
import { OrderController } from 'app/common/order/order.controller';
import { Status } from 'app/models/status';

export class ItemMenuController{

    private detailsEvent: EventEmitter<Task>;
    private removeEvent: EventEmitter<number>;
    private pomodoroEvent: EventEmitter<Task>;
    private dialog: MatDialog;
    private model: TasksModel;

    private orderController = new OrderController<Task>();

    // TODO: można zrobić model, który będzie obsługiwał zaznaczone elementy

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
        // TODO: można spróbować pobrać z bazy i przekazać dalej. Może rozwiązać problem pracy na jednym obiekcie
        // this.detailsEvent.emit(this.model.getTaskWithOpenMenu());
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
      // TODO: sprawdzi, czy aktualizują się odpowiednie elementy. Można skorzystać
      // TODO: tą część będzie trzeba przenieść w inne miejsce, tak, żeby nie było trzeba powtarzać kodu dla innych elementów

      // const tasksToUpdate = this.orderController.removeItem(task, this.model.getTasks());
      // this.updateTasks(tasksToUpdate).then(()=>{
      //   DataService.getStoreManager().getTaskStore().removeTask(task.getId()).then(()=>{

      //     this.model.removeTask(this.model.getTaskWithOpenMenu());
      //       this.removeEvent.emit(task.getId());
      //   });
      // })
      DataService.getStoreManager().getTaskStore().removeTask(task.getId()).then(updatedTasks=>{
        this.model.removeTask(task);
        this.model.updateTasks(updatedTasks);
        this.removeEvent.emit(task.getId());
      });
    }

    // TODO: oprznieść to w inne miejsce, tak, żeby wszystkie elementy które mają kolejnośc korzystały z tego samego kodu
  private updateTasks(tasks:Task[]):Promise<Task[]>{
    // TODO: napisać i wykorzystać metodę z bazy danych
    const promises = [];
    tasks.forEach(task=>{
      promises.push(DataService.getStoreManager().getTaskStore().update(task));
    });
    return Promise.all(promises);
  }


  public addTaskToPomodoro(task:Task){
    this.pomodoroEvent.emit(task);
  }

  public finishTask(task:Task){
    // TODO: będzie trzeba zauważyć, że to nie usuwa elementów, tylko ustawia odpowiednią kolejnośc
    const toUpdate = this.orderController.removeItem(task, this.model.getTasks());
    this.updateTasks(toUpdate).then(updatedTasks=>{
      DataService.getStoreManager().getTaskStore().changeStatus(task, Status.ENDED).then(updatedTasks2=>{
        this.model.removeTask(task); // TODO: tutaj zrobić warunek, czy chcemy oglądać zakończone czy nie
        this.model.updateTasks(updatedTasks);
        this.model.updateTasks(updatedTasks2);
        this.model.refresh();
      });
    });
    // TODO: pomyśleć, jak skończyć zadanie
    // TODO: znalezienie pierwszego elementu
  }
}
