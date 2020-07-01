import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  
  @Output() projectEmitter: EventEmitter<Project> = new EventEmitter();

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

  projectMenuClick(project:Project){
   
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

}
