import { ProjectStageModel } from './project.stage.model';
import { Stage } from 'app/database/shared/stage/stage';
import { ProjectDetails } from '../model/model';
import { EventBus } from 'eventbus-ts';
import { StageDetailsEvent } from '../events/stage.details.event';
import { FocusHelper } from 'app/shared/common/view_helper';
import { Project } from 'app/database/shared/project/project';
import { CommandService } from 'app/commands/manager/command.service';
import { CreateStageCommand } from 'app/commands/data-command/stage/command.create-stage';

export class ProjectStagesController {
  private STAGE_NAME_INPUT = '#new-stage-name';

  private stageModel: ProjectStageModel = new ProjectStageModel();
  private model: ProjectDetails;
  private project: Project;

  constructor(model: ProjectDetails, private commandService: CommandService) {
    this.model = model;
  }

  public setProject(project: Project) {
    this.project = project;
  }

  public getModel(): ProjectStageModel {
    return this.stageModel;
  }

  public addNewStage(name:string){
    console.log(name);
    const stage = new Stage();
    stage.name = this.stageModel.getNewStageName();
    stage.project = this.project;
    this.saveStage(stage);
  }

  private saveStage(stage: Stage) {
    this.commandService.execute(new CreateStageCommand(stage, this.model, ()=>this.closeAddingNewStage()));
  }

  public closeAddingNewStage() {
    this.stageModel.closeAddingStage();
  }

  public onCreateStageClick() {
    this.stageModel.openAddingStage();
    this.stageModel.setNewStageName('');
    FocusHelper.focus(this.STAGE_NAME_INPUT);
  }

  public onStageMenuClick(event: MouseEvent, stage: Stage) {
    // TODO: przeanalizować co to miało robić
  }

  public onEditStage(stage: Stage) {
    EventBus.getDefault().post(new StageDetailsEvent(stage));
  }
}
