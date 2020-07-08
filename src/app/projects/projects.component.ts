import { Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { ProjectsModel } from './model';
import { Project } from 'app/models/project';
import { DataService } from 'app/data.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'app/dialog/dialog.component';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  public model: ProjectsModel = new ProjectsModel();
  
  @Output() editEvent: EventEmitter<Project> = new EventEmitter();
  @Output() loadEvent: EventEmitter<Project> = new EventEmitter();
  @Output() removeEvent: EventEmitter<Project> = new EventEmitter();

  constructor(public dialog:MatDialog) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  // loading projects from database
  private loadProjects(){
    DataService.getStoreManager().getProjectStore().getAllProjects().then(projects=>{
      projects.forEach(project=>{
        this.model.addProject(project);
      });
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
    DataService.getStoreManager().getProjectStore().getProjectById(project.getId()).then(loadedProject=>{
      this.loadEvent.emit(loadedProject);
    });
    this.model.setSelectedProject(project);
  }

  public onCreateProjectClick(){
    this.editEvent.emit(new Project);
  }

  public onProjectMenuClick(event:MouseEvent, project:Project){
    let target = event.target as HTMLElement;
    target.parentElement.focus();
    event.stopPropagation();
    this.model.setProjectWithOpenMenu(project);
  }

  public onEditProject(){
    DataService.getStoreManager().getProjectStore().getProjectById(this.model.getProjectWithOpenMenu().getId()).then(loadedProject=>{
      this.editEvent.emit(loadedProject);
      this.model.setSelectedProject(this.model.getProjectWithOpenMenu());
    });
  }

  /// handle click on remove project options in menu
  public onRemoveProject(){
    return this.openRemoveConfirmationDialog().subscribe(result=>{
      if(result){
        this.removeProject();
      }
    });
  }

  private removeProject(){
    let project = this.model.getProjectWithOpenMenu();
    const id = project.getId();
    DataService.getStoreManager().getProjectStore().removeProject(id).then(()=>{
      this.model.removeProject(project);
      if(this.model.isSelectedProjectId(id)){
        // send event to main component, that close tasks view for removed project
        this.removeEvent.emit();
      }
      this.model.setProjectWithOpenMenu(null);
    });
  }

  private openRemoveConfirmationDialog(){
    const dialogRef = this.dialog.open(DialogComponent, 
      {width:"350px", data: "Czy na pewno usunąć projekt?"});
    return dialogRef.afterClosed();
  }
}
