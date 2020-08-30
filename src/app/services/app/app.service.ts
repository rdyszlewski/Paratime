import { Injectable } from '@angular/core';
import { Project } from 'app/data/models/project';
import { Task } from 'app/data/models/task';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private taskMode: TasksMode = TasksMode.LIST;
  private currentProject: Project;
  private currentTask: Task;

  constructor() { }

  public getTasksMode():TasksMode{
    return this.taskMode;
  }

  public setTasksMode(mode: TasksMode): void{
    this.taskMode = mode;
   // TODO: dobrze byłoby tutaj zrobić przeładowanie zadań i uruchomienie odpowiedniego widoku

  }

  public getCurrentProject():Project{
    return this.currentProject;
  }

  public setCurrentProject(project:Project):void{
    this.currentProject = project;
  }

  public getCurrentTask():Task{
    return this.currentTask;
  }

  public setCurrentTask(task:Task):void{
    this.currentTask = task;
  }


}

export enum TasksMode{
  LIST,
  KANBAN,
  CALENDAR
}
