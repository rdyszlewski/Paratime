import { Injectable } from '@angular/core';
import { Project } from 'app/database/shared/project/project';
import { Task } from 'app/database/shared/task/task';
import { PomodoroService } from 'app/pomodoro/pomodoro/pomodoro.service';
import { PomodoroAdapter } from 'app/shared/adapters/pomodoro.adapter';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private taskMode: TasksMode = TasksMode.LIST;
  private currentProject: Project;
  private currentTask: Task;

  constructor(private pomodoroService: PomodoroService) { }

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
    const pomodoroTask = PomodoroAdapter.createPomodoroTask(task);
    this.pomodoroService.setTask(pomodoroTask);
  }

  public isCurrentTask(task:Task):boolean{
    return task == this.currentTask;
  }
}

export enum TasksMode{
  LIST,
  KANBAN,
  CALENDAR,
  DAY_SCHEDULE
}
