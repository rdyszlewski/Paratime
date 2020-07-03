import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Project } from 'app/models/project';
import { ProjectType } from 'app/models/project_type';
import { Status } from 'app/models/status';

import { DataService } from 'app/data.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  // TODO: dodać emitter zapisywania i zamykania okna
  @Output() closeEmitter: EventEmitter<null> = new EventEmitter();
  @Output() saveEmitter: EventEmitter<Project> = new EventEmitter();
  public project: Project;

  constructor() { }

  ngOnInit(): void {
    this.project = new Project();
  }

  public setProject(project:Project){
    if(project){
      this.project = project;
    }
  }

  public getType(){
    return this.getTypeValue(this.project.getType());
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
    return this.getStatusValue(this.project.getStatus());
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
    if (this.project.getId()){
      DataService.getStoreManager().getProjectStore().updateProject(this.project).then(updatedProject=>{
        this.project=updatedProject;
        // TODO: zastanowić się, jak to powinno działać
        // this.saveEmitter.emit(updatedProject);
      })
    } else {
      DataService.getStoreManager().getProjectStore().createProject(this.project).then(createdProject=>{
        this.project=createdProject;
        console.log("Zapisany projekt");
        console.log(createdProject);
        this.saveEmitter.emit(createdProject);
      });
    }
  }

}
