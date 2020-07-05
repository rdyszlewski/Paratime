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

  // TODO: dodać emitter zapisywania i zamykania okna
  @Output() closeEmitter: EventEmitter<null> = new EventEmitter();
  @Output() saveEmitter: EventEmitter<Project> = new EventEmitter();
  @Output() updateEvent: EventEmitter<Project> = new EventEmitter();

  public model: ProjectDetails = new ProjectDetails();
  // public project: Project = new Project();

  constructor() { }

  ngOnInit(): void {
    
  }

  public setProject(project:Project){
    this.model.setProject(project);
  }

  public getType(){
    return this.getTypeValue(this.model.getProject().getType());
  }

  private getTypeValue(type:ProjectType):string{
    // TODO: sprawdzić, czy jest jakaś możliwość, aby wziąć nazwę stałej i zmniejszyć jej litetry
    // TODO: przenieść to gdzieś. Zrobić jakieś kreatory
    switch(type){
      case ProjectType.DEFAULT:
        return 'default';
      case ProjectType.SMALL:
        return 'small';
      case ProjectType.MEDIUM:
        return 'medium';
      case ProjectType.BIG:
        return 'big';
      default:
        return 'default';
    }
  }

  public getStatus(){
    return this.getStatusValue(this.model.getProject().getStatus());
  }

  private getStatusValue(status:Status): string{
    switch(status){
      case Status.STARTED:
        return 'started';
      case Status.ENDED:
        return 'ended';
      case Status.CANCELED:
        return 'canceled';
      case Status.AWAITING:
        return 'awaiting';
      default:
        return 'awaiting';
    }
  }

  close(){
    this.closeEmitter.emit();
  }

  save(){
    // TODO: napisać kod odpowiedzialny za zapisywanie projektu
    
    if(!this.model.isUpdateMode()){
      DataService.getStoreManager().getProjectStore().createProject(this.model.getProject()).then(createdProject=>{
        this.model.setProject(createdProject);
        this.saveEmitter.emit(createdProject);
      });
    }
  }

  public updateProject(){
    console.log("Aktualizowanie projektu");
    if(this.model.isUpdateMode()){
      DataService.getStoreManager().getProjectStore().updateProject(this.model.getProject()).then(()=>{
        this.updateEvent.emit(this.model.getProject());
      });
    }
  }

}
