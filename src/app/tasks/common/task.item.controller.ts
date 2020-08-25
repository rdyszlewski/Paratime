import { Task } from 'app/models/task';
import { DataService } from 'app/data.service';
import { Status } from 'app/models/status';

export class TaskItemController {

  public toggleTaskImportance(task: Task, event: MouseEvent) {
    task.setImportant(!task.isImportant());
    this.updateTask(task);
    event.stopPropagation();
  }

  private updateTask(task: Task) {
    DataService.getStoreManager().getTaskStore().update(task);
  }

  public isTaskDone(task: Task): boolean {
    return task.getStatus() == Status.ENDED;
  }

  public setTaskStatus(task: Task, checked: boolean) {
    // TODO: opracować zmianę na wszystkie stany
    if (checked) {
      task.setStatus(Status.ENDED);
    } else {
      task.setStatus(Status.STARTED);
    }
    this.updateTask(task);
  }

  // TODO: zmienić tę nazwę
  public checkBoxClick(event: MouseEvent) {
    event.stopPropagation();
  }
}
