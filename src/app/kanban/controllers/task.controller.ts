import { KanbanModel } from '../kanban.model';
import { KanbanColumn, KanbanTask } from 'app/models/kanban';
import { InsertTaskData } from 'app/data/common/models/insert.task.data';
import { DataService } from 'app/data.service';
import { Task } from 'app/models/task';
import { MatDialog } from '@angular/material/dialog';
import { DialogHelper } from 'app/common/dialog';
import { EventEmitter } from '@angular/core';
import { Status } from 'app/models/status';

type RemoveCallback = (task: KanbanTask) => void;

export class KanbanTaskController {
  private model: KanbanModel;
  private dialog: MatDialog;
  private removeEvent: EventEmitter<Task>;

  constructor(model: KanbanModel, dialog: MatDialog, removeEvent: EventEmitter<Task>) {
    this.model = model;
    this.dialog = dialog;
    this.removeEvent = removeEvent;
  }

  // ADDING
  public addTask(column: KanbanColumn) {
    const task = this.prepareTaskToInsert();
    const data = new InsertTaskData(task, column, this.model.getProject().getId());

    DataService.getStoreManager()
      .getTaskStore()
      .createTask(data)
      .then((result) => {
        this.model.updateTasks(result.updatedKanbanTasks, data.column.getId());
      });
  }

  private prepareTaskToInsert() {
    const task = new Task(this.model.getNewTaskName());
    task.setProject(this.model.getProject());
    return task;
  }


  // REMOVING
  public  removeTask(task: KanbanTask): void {
    this.showRemoveMessage(task, this.removeTaskFromStore);
  }

  private showRemoveMessage(task: KanbanTask, callback: RemoveCallback){
    const message = 'Czy na pewno usunąć zadanie?';
    DialogHelper.openDialog(message, this.dialog).subscribe((result) => {
      if (result) {
        callback(task);
      }
    });
  }

  private removeTaskFromStore(task: KanbanTask): void{
    DataService.getStoreManager()
    .getKanbanTaskStore()
    .removeTask(task.getId())
    .then((updatedTasks) => {
      this.model.updateTasks(updatedTasks, task.getColumnId());
      this.removeEvent.emit(task.getTask());
    });
  }

  // FINISH
  public finishTask(task: KanbanTask): void {
    DataService.getStoreManager()
      .getTaskStore()
      .changeStatus(task.getTask(), Status.ENDED)
      .then((updatedTasks) => {
        // tutaj nie robimy nic. Zostawiamy zakończone zadania na liście
      });
  }
}
