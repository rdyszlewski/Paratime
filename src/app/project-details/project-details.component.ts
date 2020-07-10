import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Project } from 'app/models/project';
import { ProjectType } from 'app/models/project_type';
import { Status } from 'app/models/status';

import { DataService } from 'app/data.service';
import { ProjectDetails } from './model';
import { Stage } from 'app/models/stage';
import * as $ from 'jquery';
import { KeyCode } from 'app/common/key_codes';
import { FocusHelper } from 'app/common/view_helper';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  private STAGE_NAME_INPUT = '#new-stage-name';

  @Output() closeEvent: EventEmitter<null> = new EventEmitter();
  @Output() saveEvent: EventEmitter<Project> = new EventEmitter();
  @Output() updateEvent: EventEmitter<Project> = new EventEmitter();
  @Output() editStageEvent: EventEmitter<Stage> = new EventEmitter();
 
  public model: ProjectDetails = new ProjectDetails();
  public projectType = ProjectType;
  public status = Status;

  constructor() { }

  ngOnInit(): void {
    // TODO: usunąć to
    this.model.getProject().setId(1);
  }

  public setProject(project:Project){
    this.model.setProject(project);
  }

  public closeView(){
    this.closeEvent.emit();
  }

  public updateProject(){
    // TODO: można też zrobić aktualizację dopiero przy zamykaniu okna. W ten sposób będzie sporo przesyłania danych na serwer
    DataService.getStoreManager().getProjectStore().updateProject(this.model.getProject()).then(()=>{
      this.updateEvent.emit(this.model.getProject());
    });
  }

  public getDateText(date:Date){
    return date.toDateString();
  }

  public onStageMenuClick(event: MouseEvent, stage:Stage){

  }

  public onEditStage(stage:Stage){
    this.editStageEvent.emit(stage);
  }

  public onRemoveStage(stage:Stage){
    DataService.getStoreManager().getStageStore().removeStage(stage.getId()).then(()=>{
      this.model.getProject().removeStage(stage);
    });
  }

  public handleAddingNewStageKeyUp(event:KeyboardEvent){
    switch(event.keyCode){
      case KeyCode.ENTER:
        this.addNewStage();
        break;
      case KeyCode.ESC:
        this.closeAddingNewStage();
        break;
    }
  }

  public addNewStage(){
      const stage = new Stage();
      stage.setName(this.model.getNewStageName());
      stage.setProject(this.model.getProject());
      this.saveStage(stage);
  }

  private saveStage(stage:Stage){
    DataService.getStoreManager().getStageStore().createStage(stage).then(insertedStage=>{
      this.model.getProject().addStage(insertedStage);
      this.closeAddingNewStage();
    });
  }
  
  public closeAddingNewStage(){
    this.model.setAddingStageMode(false);
  }

  public onCreateStageClick(){
    this.model.setAddingStageMode(true);
    this.model.setNewStageName("");
    FocusHelper.focus(this.STAGE_NAME_INPUT);
  }


}
