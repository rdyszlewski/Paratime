import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscribe, EventBus } from 'eventbus-ts';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { StageDetailsComponent } from './stage-details/stage-details.component';
import { Task } from 'app/database/shared/task/task';
import { Stage } from 'app/database/shared/stage/stage';
import { Project } from 'app/database/shared/project/project';

export enum DetailsType{
  PROJECT,
  STAGE,
  TASK
}

@Component({
  selector: 'app-details-container',
  templateUrl: './details-container.component.html',
  styleUrls: ['./details-container.component.css']
})
export class DetailsContainerComponent implements OnInit {

  @ViewChild(ProjectDetailsComponent)
  private projectDetailsComponent: ProjectDetailsComponent;

  @ViewChild(TaskDetailsComponent)
  private taskDetailsComponent:TaskDetailsComponent;

  @ViewChild(StageDetailsComponent)
  private stageDetailsComponent: StageDetailsComponent;

  public detailsType = DetailsType;

  private _type: DetailsType= null;


  private lastEditedProject: Project;

  public get type(): DetailsType{
    return this._type;
  }

  constructor() {
    console.log("register");
    EventBus.getDefault().register(this);
  }

  ngOnInit(): void {

  }

  public openDetails(type: DetailsType){
    this._type = type;
  }

  public closeDetails(){
    if(this._type==DetailsType.STAGE){
      this._type = DetailsType.PROJECT;
    } else {
      this._type = null;
    }
  }

  public isOpen(){
    return this._type != null;
  }

  @Subscribe("ProjectEditEvent")
  public openProjectDetails(project: Project){
    this.projectDetailsComponent.setProject(project);
    this.openDetails(DetailsType.PROJECT);
    this.lastEditedProject = project;
  }

  @Subscribe("TaskDetailsEvent")
  public openTaskDetails(task: Task){
    this.taskDetailsComponent.setTask(task);
    this.openDetails(DetailsType.TASK);
  }

  @Subscribe("StageDetailsEvent")
  public openStageDetails(stage:Stage){
    this.stageDetailsComponent.setStage(stage);
    this.openDetails(DetailsType.STAGE);
  }
}
