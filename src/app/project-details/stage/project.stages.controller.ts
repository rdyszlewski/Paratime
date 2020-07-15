import { ProjectStageModel } from './project.stage.model';
import { Stage } from 'app/models/stage';
import { Project } from 'app/models/project';
import { DataService } from 'app/data.service';
import { FocusHelper } from 'app/common/view_helper';
import { EditInputHandler } from 'app/common/edit_input_handler';
import { EventEmitter } from '@angular/core';

export class ProjectStagesController{
    
    private STAGE_NAME_INPUT = '#new-stage-name';

    private editEvent: EventEmitter<Stage> = new EventEmitter();
    private model: ProjectStageModel = new ProjectStageModel();
    private project: Project;

    constructor(editEvent:EventEmitter<Stage>){
        this.editEvent = editEvent;
    }

    public setProject(project: Project){
        this.project = project;
    }

    public getModel(): ProjectStageModel{
        return this.model;
    }

    public addNewStage(){
        const stage = new Stage();
        stage.setName(this.model.getNewStageName());
        stage.setProject(this.project);
        this.saveStage(stage);
    }
  
    private saveStage(stage:Stage){
      DataService.getStoreManager().getStageStore().createStage(stage).then(insertedStage=>{
        this.project.addStage(insertedStage);
        this.closeAddingNewStage();
      });
    }
    
    public closeAddingNewStage(){
        this.model.closeAddingStage();
    }
  
    public onCreateStageClick(){
      this.model.openAddingStage();
      this.model.setNewStageName("");
      FocusHelper.focus(this.STAGE_NAME_INPUT);
    }

    public handleAddingNewStageKeyUp(event:KeyboardEvent){
        EditInputHandler.handleKeyEvent(event, 
          ()=>this.addNewStage(),
          ()=>this.closeAddingNewStage()
        );
    }

    public onStageMenuClick(event: MouseEvent, stage:Stage){
        // TODO: przeanalizować co to miało robić
    }

    public onEditStage(stage:Stage){
        this.editEvent.emit(stage);
      }
}