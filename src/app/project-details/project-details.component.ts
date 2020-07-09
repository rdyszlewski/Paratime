import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Project } from 'app/models/project';
import { ProjectType } from 'app/models/project_type';
import { Status } from 'app/models/status';

import { DataService } from 'app/data.service';
import { ProjectDetails } from './model';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  @Output() closeEvent: EventEmitter<null> = new EventEmitter();
  @Output() saveEvent: EventEmitter<Project> = new EventEmitter();
  @Output() updateEvent: EventEmitter<Project> = new EventEmitter();

  public model: ProjectDetails = new ProjectDetails();
  public projectType = ProjectType;
  public status = Status;

  constructor() { }

  ngOnInit(): void {
    
  }

  public setProject(project:Project){
    this.model.setProject(project);
  }

  public closeView(){
    this.closeEvent.emit();
  }

  public updateProject(){
    DataService.getStoreManager().getProjectStore().updateProject(this.model.getProject()).then(()=>{
      this.updateEvent.emit(this.model.getProject());
    });
  }
}
