import { Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { ProjectsModel } from './model';
import { Project } from 'app/models/project';
import { DataService } from 'app/data.service';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  model: ProjectsModel;
  private lastContextOpen: Project = null;
  
  @Output() projectEmitter: EventEmitter<Project> = new EventEmitter();

  contextMenuPosition = { x: '0px', y: '0px' };

  constructor() { }

  ngOnInit(): void {
    this.model = new ProjectsModel();

    this.loadProjects();
    
  }

  private loadProjects(){
    DataService.getStoreManager().getProjectStore().getAllProjects().then(projects=>{
      projects.forEach(project=>{
        this.model.addProject(project);
      });
    });
  }

  projectClick(project:Project){
    this.projectEmitter.emit(project);
    this.model.setSelectedProject(project);
  }

  createProjectClick(){
    this.projectEmitter.emit(null);
  }

  // projectMenuClick(project:Project){
   
  // }

  projectMenuClick(event:MouseEvent, project:Project){
    // TODO; okazuje się, że focus nie działa
    let target = event.target as HTMLElement;
    target.parentElement.focus();
    event.stopPropagation();
    this.lastContextOpen = project;
    
    console.log(target.parentElement);
  }

  filterProjects(filterValue: string):void{
    this.model.filterProject(filterValue);
  }

  isSelectedProject(project:Project):boolean{
    if(this.model.getSelectedProject()==null){
      return false;
    }
    return project.getId() == this.model.getSelectedProject().getId();
  }

  editProject(){
    console.log("Edytujemy projekt");
    console.log(this.lastContextOpen);
  }

  removeProject(){
    console.log("Usuwamy projekt");
    console.log(this.lastContextOpen)
  }

}
