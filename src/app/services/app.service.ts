import { Injectable } from '@angular/core';
import { Project } from 'app/models/project';
import { Task } from 'app/models/task';
import { TypeScriptEmitter } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private currentProject: Project;
  private currentTask: Task;

  constructor() { }

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
