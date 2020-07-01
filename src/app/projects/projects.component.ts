import { Component, OnInit } from '@angular/core';
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
    console.log("Kliknięto projekt " + project.getName());
  }

  createProjectClick(){
    console.log("Kliknięto tworznie nowego projektu");
  }

  projectMenuClick(project:Project){
    console.log("Kliknięto menu projektu " + project.getName());
  }

}
