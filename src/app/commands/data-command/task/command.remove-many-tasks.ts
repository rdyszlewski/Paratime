import { DataCommand } from 'app/commands/data-commnad';
import { Task } from 'app/database/shared/task/task';
import { TaskDay } from 'app/tasks/tasks-container/calendar/task.day';
import { IRemoveTaskCallback } from './callback.remove-task';



export class RemoveManyTasksCommand extends DataCommand{

  private callback:IRemoveTaskCallback;

  constructor(private tasks: Task[]){
    super();
  }

  public setCallback(callback: IRemoveTaskCallback):RemoveManyTasksCommand{
    this.callback = callback;
    return this;
  }

  public execute() {
    let actions = this.tasks.map(task=>this._dataService.getTaskService().remove(task));
    Promise.all(actions).then(results=>{
      this.callback.execute(results);
    });
  }

  private isCorrectCell(x: TaskDay, date: Date): boolean {
    return x.month == date.getMonth() && x.day == date.getDate() && x.year == date.getFullYear();
  }

  private

  public unExecute() {
    throw new Error('Method not implemented.');
  }

  public getDescription(): string {
    return `Usuwanie zadań ${this.tasks.length}`;
  }
}
