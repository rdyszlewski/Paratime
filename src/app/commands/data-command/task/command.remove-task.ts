import { DataCommand } from 'app/commands/data-commnad';
import { KanbanTask } from 'app/database/shared/kanban-task/kanban-task';
import { Task } from 'app/database/shared/task/task';
import { ITaskItem } from 'app/database/shared/task/task.item';
import { TaskRemoveResult } from 'app/database/shared/task/task.remove-result';
import { TaskRemoveEvent } from 'app/tasks/tasks-container/events/remove.event';
import { TasksModel } from 'app/tasks/tasks-container/tasks/model';
import { EventBus } from 'eventbus-ts';

export class RemoveTaskCommand extends DataCommand{


  constructor(private task: Task, private model: TasksModel){
    super();
  }

  execute() {
    this.removeTaskFromDatabase(this.task).then(result=>{
      this.model.updateTasks(result.updatedTasks);
      EventBus.getDefault().post(new TaskRemoveEvent(this.task));
    });
  }

  private removeTaskFromDatabase(task: ITaskItem):Promise<TaskRemoveResult>{
    if(task instanceof Task){
      return this._dataService.getTaskService().remove(task);
    } else if (task instanceof KanbanTask){
      return this._dataService.getKanbanTaskService().remove(task.getTask());
    }
  }

  unExecute() {
    throw new Error('Method not implemented.');
  }

  getDescription(): string {
    return `Usunięto zadanie ${this.task.getName()}`;
  }
}
