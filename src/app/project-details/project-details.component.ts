import { Component, OnInit } from '@angular/core';
import { Project } from 'app/models/project';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  private project:Project;

  constructor() { }

  ngOnInit(): void {
  }

  public setProject(project:Project){
    console.log("Weszło tutaj");
    console.log(project);
    
    this.project = project;
  }

  close(){

  }

  save(){
    
  }

  

}
