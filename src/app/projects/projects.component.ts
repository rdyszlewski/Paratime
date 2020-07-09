import { Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { ProjectsModel } from './model';
import { Project } from 'app/models/project';
import { DataService } from 'app/data.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'app/dialog/dialog.component';
import * as $ from 'jquery';
import { KeyCode } from 'app/common/key_codes';
import { FocusHelper } from 'app/common/view_helper';
import { DialogHelper } from 'app/common/dialog';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  private PROJECT_NAME_INPUT = '#new-project-name';
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
    // TODO: później popranie to ustawić
    // this.editEvent.emit(new Project);
    this.model.setAddingNewProject(true);
    FocusHelper.focus(this.PROJECT_NAME_INPUT);
    this.scrollToBottom();
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
    const message = "Czy na pewno usunąć projekt?";
    return DialogHelper.openDialog(message, this.dialog);
  }

  public addNewProject(){
    this.saveProject();
  }

  private scrollToBottom(){
    let scrollContainer = $("#projects-list");
    setTimeout(()=>{
      scrollContainer.animate({ scrollTop: $(document).height() }, 1000);;
    },0); 
  }

  public closeAddingNewProject(){
    console.log("Schowano dodanie zadania");
    this.model.setNewProjectName("");
    this.model.setAddingNewProject(false);
  }

  public saveProject(){
    const project = new Project();
    project.setName(this.model.getNewProjectName());
    DataService.getStoreManager().getProjectStore().createProject(project).then(insertedProject=>{
      this.model.addProject(insertedProject);
      this.closeAddingNewProject();
      this.scrollToBottom();
    });
  }

  public handleAddingNewProjectKeyUp(event:KeyboardEvent){
    if(event.keyCode == KeyCode.ENTER){
      this.addNewProject();
    } 
    if(event.keyCode == KeyCode.ESC){
      this.closeAddingNewProject();
    }
  }
}
