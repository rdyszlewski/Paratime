import { KanbanModel } from '../kanban.model';
import { KanbanColumn, KanbanTask } from 'app/database/data/models/kanban';
import { InsertTaskData } from 'app/database/data/common/models/insert.task.data';
import { DataService } from 'app/data.service';
import { Task } from 'app/database/data/models/task';
import { MatDialog } from '@angular/material/dialog';
import { Status } from 'app/database/data/models/status';
import { DialogHelper } from 'app/shared/common/dialog';
import { EventBus } from 'eventbus-ts';
import { TaskRemoveEvent } from '../../events/remove.event';

type RemoveCallback = (task: KanbanTask) => void;

export class KanbanTaskController {
  private model: KanbanModel;
  private dialog: MatDialog;

  constructor(model: KanbanModel, dialog: MatDialog) {
    this.model = model;
    this.dialog = dialog;
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

  private removeTaskFromStore(kanbanTask: KanbanTask): void{
    DataService.getStoreManager()
    .getKanbanTaskStore()
    .removeTask(kanbanTask.getId())
    .then((updatedTasks) => {
      this.model.updateTasks(updatedTasks, kanbanTask.getColumnId());
      EventBus.getDefault().post(new TaskRemoveEvent(kanbanTask.getTask()));
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
