import { DataCommand } from 'app/commands/data-commnad';
import { KanbanColumn } from 'app/database/shared/kanban-column/kanban-column';
import { Status } from 'app/database/shared/models/status';
import { Project } from 'app/database/shared/project/project';
import { Task } from 'app/database/shared/task/task';
import { TaskInsertData } from 'app/database/shared/task/task.insert-data';
import { TaskInsertResult } from 'app/database/shared/task/task.insert-result';

export class CreateTaskCommand extends DataCommand{

  private column: KanbanColumn;
  private date: Date;
  private callback: (task: TaskInsertResult)=>void;

  constructor(private name: string, private project: Project){
    super();
  }

  public setColumn(column: KanbanColumn){
    this.column = column;
    return this;
  }

  public setDate(date: Date){
    this.date = date;
    return this;
  }

  public setCallback(callback: (task: TaskInsertResult)=>void){
    this.callback = callback;
    return this;
  }

  public execute() {
    // TODO: sprawdzić, co z tą datą
    const task = this.prepareTaskToInsert(this.name, this.project);
    let data = new TaskInsertData(task, this.column, this.project.id);
    this._dataService.getTaskService().create(data).then(result=>{
      if(this.callback){
        this.callback(result);
      }
    });
  }

  private prepareTaskToInsert(name: string, project: Project = null, date:Date=null){
    const task = new Task();
    task.name = name;
    task.project = project;
    task.date = date;
    task.status = Status.STARTED;
    return task;
  }

  unExecute() {
    throw new Error('Method not implemented.');
  }

  getDescription(): string {
    return `Utworzono zadanie ${this.name}`;
  }

}
