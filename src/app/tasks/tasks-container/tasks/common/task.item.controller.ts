import { Task } from 'app/database/shared/task/task';
import { DataService } from 'app/data.service';
import { Status } from 'app/database/shared/models/status';
import { CommandService } from 'app/commands/manager/command.service';
import { UpdateTaskCommand } from 'app/commands/data-command/task/command.update-task';

export class TaskItemController {

  constructor(private commandService: CommandService){
  }

  // TODO: to powinno być przeniesione gdzieś do komendy
  public toggleTaskImportance(task: Task, event: MouseEvent) {
    task.important = !task.important;
    this.updateTask(task);
    event.stopPropagation();
  }

  private updateTask(task: Task) {
    this.commandService.execute(new UpdateTaskCommand(task));
  }

  public isTaskDone(task: Task): boolean {
    return task.status == Status.ENDED;
  }

  public setTaskStatus(task: Task, checked: boolean) {
    // TODO: opracować zmianę na wszystkie stany
    task.status = checked ? Status.ENDED : Status.STARTED;
    this.updateTask(task);
  }

  // TODO: zmienić tę nazwę
  public checkBoxClick(event: MouseEvent) {
    event.stopPropagation();
  }
}
