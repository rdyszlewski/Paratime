import { Task } from 'app/database/data/models/task';
import { DataService } from 'app/data.service';
import { Status } from 'app/database/data/models/status';

export class TaskItemController {

  constructor(private dataService: DataService){
  }

  public toggleTaskImportance(task: Task, event: MouseEvent) {
    task.setImportant(!task.isImportant());
    this.updateTask(task);
    event.stopPropagation();
  }

  private updateTask(task: Task) {
    this.dataService.getTaskService().update(task);
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
