import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProjectsModel } from './common/model';
import { Project } from 'app/data/models/project';
import { DataService } from 'app/data.service';
import { MatDialog } from '@angular/material/dialog';
import { Status } from 'app/data/models/status';
import { ProjectType } from 'app/data/models/project_type';
import { ProjectsViewState } from './common/state';
import { ProjectsFilteringController } from './filtering/projects.filtering.controller';
import { ProjectAddingController } from './adding/projects.adding.controller';
import { ProjectsRemovingController } from './removing/projects.removing.controller';
import { ProjectsLoader } from './common/projects.loader';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { EventBus } from 'eventbus-ts';
import { ProjectLoadEvent, ProjectEditEvent } from './events/project.event';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  private model: ProjectsModel;
  private state: ProjectsViewState;
  private filteringController: ProjectsFilteringController;
  private addingController: ProjectAddingController;
  private removingController: ProjectsRemovingController;

  public status = Status;
  public type = ProjectType;

  constructor(public dialog:MatDialog) { }

  ngOnInit(): void {
    this.model = new ProjectsModel();
    this.state = new ProjectsViewState();
    this.filteringController = new ProjectsFilteringController(this.model);
    this.addingController = new ProjectAddingController(this.state, this.model);
    this.removingController = new ProjectsRemovingController(this.model, this.dialog);
    this.loadProjects();
  }

  public getModel():ProjectsModel{
    return this.model;
  }

  public getState():ProjectsViewState{
    return this.state;
  }

  public getFiltering():ProjectsFilteringController{
    return this.filteringController;
  }

  public getAdding():ProjectAddingController{
    return this.addingController;
  }

  public getRemoving(): ProjectsRemovingController{
    return this.removingController;
  }

  // loading projects from database
  private loadProjects(){
    ProjectsLoader.loadProjectsFromStore().then(projects=>{
      this.model.setProjects(projects);
    });
  }

  // update project on the list
  public updateProject(project:Project){
    this.model.updateProject(project);
  }

  /// add project to projects list
  public addProject(project:Project):void{
    this.model.addProject(project);
  }

  /// select project on the list and open it
  public selectProject(project:Project){
    this.model.setSelectedProject(project);
    this.onProjectClick(project);
  }

// click events

  public onProjectClick(project:Project){
    // this.loadEvent.emit(project);
    EventBus.getDefault().post(new ProjectLoadEvent(project));
  }

  public onProjectMenuClick(event:MouseEvent, project:Project){
    let target = event.target as HTMLElement;
    target.parentElement.focus();
    event.stopPropagation();
    this.model.setProjectWithOpenMenu(project);
  }

  public onEditProject(){
    DataService.getStoreManager().getProjectStore().getProjectById(this.model.getProjectWithOpenMenu().getId()).then(loadedProject=>{
      // this.editEvent.emit(loadedProject);
      console.log("Jestem tutaj");
      EventBus.getDefault().post(new ProjectEditEvent(loadedProject));
      this.model.setSelectedProject(this.model.getProjectWithOpenMenu());
    });
  }

  public openKanban(){
    // TODO: przerobić sposób przekazywania projektu podczas zdarzenia menu
    // this.kanbanEvent.emit(this.model.getProjectWithOpenMenu());
  }

  public onDrop(event:CdkDragDrop<string[]>){
    if(event.previousContainer === event.container){
      this.changeTasksOrder(event.previousIndex, event.currentIndex);
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  private changeTasksOrder(previousIndex: number, currentIndex:number){
    const previousTask = this.model.getProjectByIndex(previousIndex);
    const currentTask = this.model.getProjectByIndex(currentIndex);
    DataService.getStoreManager().getProjectStore().move(previousTask, currentTask, previousIndex > currentIndex).then(updatedProjects=>{
      this.model.updateProjects(updatedProjects);
    });
  }
}
