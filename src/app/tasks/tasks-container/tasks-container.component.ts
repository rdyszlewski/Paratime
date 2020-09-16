import { Component, OnInit, ViewChild, AfterViewInit, AfterContentInit } from '@angular/core';
import { Project } from 'app/database/data/models/project';
import { Task } from 'app/database/data/models/task';
import { ITaskList } from './task.list';
import { EventBus, Subscribe } from 'eventbus-ts';
import { TasksComponent } from './tasks/tasks.component';
import { KanbanComponent } from './kanban/kanban.component';
import { TasksMode, AppService } from 'app/core/services/app/app.service';
import { CalendarComponent } from './calendar/calendar.component';

@Component({
  selector: 'app-tasks-container',
  templateUrl: './tasks-container.component.html',
  styleUrls: ['./tasks-container.component.css']
})
export class TasksContainerComponent implements OnInit, AfterViewInit {

  @ViewChild(TasksComponent)
  private tasksComponent: TasksComponent;

  @ViewChild(KanbanComponent)
  private kanbanComponent: KanbanComponent;

  @ViewChild(CalendarComponent)
  private calendarComponent: CalendarComponent;
  // TODO: zrobić interfejs do tego wszystkiego

  private _project: Project;
  private _mode: TasksMode;
  private _currentList: ITaskList

  public taskMode = TasksMode;

  public get mode():TasksMode{
    return this._mode;

  }

  constructor(private appService: AppService) {
    EventBus.getDefault().register(this);
   }

  ngAfterViewInit(): void {
    this.changeTaskMode(this._mode);
  }

  ngOnInit(): void {
    this._mode = TasksMode.LIST;
  }

  public getProjectName(){
    if(this._project != null){
      return this._project.getName();
    }
  }



  public openProject(project:Project):void{
    this._project = project;
    this.appService.setCurrentProject(project);
    // this.changeTaskMode(taskMode);
    if(this._currentList){
      this._currentList.openProject(project);
    }
    //TODO: dokończyć to
  }

  public changeTaskMode(taskMode: TasksMode){
    this._mode = taskMode;
    switch(taskMode){
      case TasksMode.LIST:
        this._currentList = this.tasksComponent;
        break;
      case TasksMode.KANBAN:
        this._currentList = this.kanbanComponent;
        break;
      case TasksMode.CALENDAR:
        this._currentList = this.calendarComponent;
        break;
    }
    if(this._project){
      this.openProject(this._project);
    } else {
      this.openProject(this.appService.getCurrentProject());
    }
  }

  @Subscribe("TaskRemoveEvent")
  public removeTask(task: Task){
    // TODO: dokończyć to
  }

  public setActiveTask(task:Task){
    // TODO: dokończyć to
  }

  @Subscribe("ProjectLoadEvent")
  public onProjectLoad(project:Project){
    this._currentList.openProject(project);
    this.appService.setCurrentProject(project);
  }

}
