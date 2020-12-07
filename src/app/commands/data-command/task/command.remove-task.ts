import { DataCommand } from 'app/commands/data-commnad';
import { KanbanTask } from 'app/database/shared/kanban-task/kanban-task';
import { Task } from 'app/database/shared/task/task';
import { ITaskItem } from 'app/database/shared/task/task.item';
import { TaskRemoveResult } from 'app/database/shared/task/task.remove-result';
import { TaskRemoveEvent } from 'app/tasks/tasks-container/events/remove.event';
import { EventBus } from 'eventbus-ts';

export class RemoveTaskCommand extends DataCommand{

  private callback: (result:TaskRemoveResult)=>void;

  constructor(private task: Task){
    super();
  }

  public setCallback(callback: (result: TaskRemoveResult)=>void): RemoveTaskCommand{
    this.callback = callback;
    return this;
  }

  execute() {
    this.removeTaskFromDatabase(this.task).then(result=>{
      // TODO: prawdopdobnie tutaj będzie trzeba zrobić callback
      if(this.callback){
        this.callback(result);
      }
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
