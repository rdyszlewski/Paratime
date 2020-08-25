import { Component, OnInit, ViewChild, AfterViewInit, AfterContentInit } from '@angular/core';
import { Project } from 'app/models/project';
import { TasksMode, AppService } from 'app/services/app/app.service';
import { Task } from 'app/models/task';
import { ITaskList } from './task.list';
import { TasksComponent } from 'app/tasks/tasks.component';
import { KanbanComponent } from 'app/kanban/kanban.component';
import { ThrowStmt } from '@angular/compiler';

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
  // TODO: zrobić interfejs do tego wszystkiego

  private _project: Project;
  private _mode: TasksMode;
  private _currentList: ITaskList

  public taskMode = TasksMode;

  public get mode():TasksMode{
    return this._mode;

  }

  constructor(private appService: AppService) { }

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
    console.log("Otwieranie projektu");
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
    }
    this.openProject(this._project);
  }

  public openDetails(task:Task){
    this._currentList.openDetails(task);
    // TODO: dokończyć
  }

  public removeTask(task: Task){
    // TODO: dokończyć to
  }

  public setActiveTask(task:Task){
    // TODO: dokończyć to
  }



}
