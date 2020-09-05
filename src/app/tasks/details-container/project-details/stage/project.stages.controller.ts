import { ProjectStageModel } from './project.stage.model';
import { Stage } from 'app/database/data/models/stage';
import { Project } from 'app/database/data/models/project';
import { DataService } from 'app/data.service';
import { FocusHelper } from 'app/common/view_helper';
import { EditInputHandler } from 'app/common/edit_input_handler';
import { EventEmitter } from '@angular/core';
import { ProjectDetails } from '../model/model';
import { EventBus } from 'eventbus-ts';
import { StageDetailsEvent } from '../events/stage.details.event';

export class ProjectStagesController {
  private STAGE_NAME_INPUT = '#new-stage-name';

  private editEvent: EventEmitter<Stage> = new EventEmitter();
  private stageModel: ProjectStageModel = new ProjectStageModel();
  private model: ProjectDetails;
  private project: Project;

  constructor(editEvent: EventEmitter<Stage>, model: ProjectDetails) {
    this.editEvent = editEvent;
    this.model = model;
  }

  public setProject(project: Project) {
    this.project = project;
  }

  public getModel(): ProjectStageModel {
    return this.stageModel;
  }

  public addNewStage() {
    const stage = new Stage();
    stage.setName(this.stageModel.getNewStageName());
    stage.setProject(this.project);
    this.saveStage(stage);
  }

  private saveStage(stage: Stage) {
    DataService.getStoreManager()
      .getStageStore()
      .createStage(stage)
      .then((updatedStages) => {
        this.model.updateStages(updatedStages);
        this.closeAddingNewStage();
      });
  }

  public closeAddingNewStage() {
    this.stageModel.closeAddingStage();
  }

  public onCreateStageClick() {
    this.stageModel.openAddingStage();
    this.stageModel.setNewStageName('');
    FocusHelper.focus(this.STAGE_NAME_INPUT);
  }

  public handleAddingNewStageKeyUp(event: KeyboardEvent) {
    EditInputHandler.handleKeyEvent(
      event,
      () => this.addNewStage(),
      () => this.closeAddingNewStage()
    );
  }

  public onStageMenuClick(event: MouseEvent, stage: Stage) {
    // TODO: przeanalizować co to miało robić
  }

  public onEditStage(stage: Stage) {
    EventBus.getDefault().post(new StageDetailsEvent(stage));
  }
}
