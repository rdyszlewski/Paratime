import { Component, OnInit} from '@angular/core';
import { ProjectType } from 'app/database/shared/project/project_type';
import { Status } from 'app/database/shared/models/status';
import { DataService } from 'app/data.service';
import { ProjectDetails } from './model/model';
import { Stage } from 'app/database/shared/stage/stage';
import { ProjectDetailsState } from './model/state';
import { ProjectChangeDetector } from './model/change.detector';
import { ProjectValidator } from './model/validator';
import { ProjectStagesController } from './stage/project.stages.controller';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { DateFormatter } from 'app/shared/common/date_formatter';
import { EventBus } from 'eventbus-ts';
import { ProjectDetailsCloseEvent } from './events/close.event';
import { Project } from 'app/database/shared/project/project';
import { CommandService } from 'app/commands/manager/command.service';
import { UpdateProjectCommand } from 'app/commands/data-command/project/command.update-project';
import { RemoveStageCommand } from 'app/commands/data-command/stage/command.remove-stage';
import { ChangeStageOrderCommand } from 'app/commands/data-command/stage/command.change-stage-order';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css'],
})
export class ProjectDetailsComponent implements OnInit {

  private model: ProjectDetails;
  private state: ProjectDetailsState;
  private changeDetector: ProjectChangeDetector;
  private validator: ProjectValidator;
  private stageController: ProjectStagesController;

  // enums
  public projectType = ProjectType;
  public status = Status;

  constructor(private commandService: CommandService, private dataService: DataService){
``
  }

  ngOnInit(): void {
    // TODO: poprzerabiać to w taki sposób, aby ułatwić testowanie
    this.model = new ProjectDetails();
    this.state = new ProjectDetailsState(this.model);
    this.changeDetector = new ProjectChangeDetector(this.model);
    this.validator = new ProjectValidator(this.model);
    this.stageController = new ProjectStagesController(
      this.model, this.commandService
    );
  }

  public getModel(): ProjectDetails {
    return this.model;
  }

  public getState(): ProjectDetailsState {
    return this.state;
  }

  public getChangeDetector(): ProjectChangeDetector {
    return this.changeDetector;
  }

  public getValidator(): ProjectValidator {
    return this.validator;
  }

  public getStages(): ProjectStagesController {
    return this.stageController;
  }

  public setProject(project: Project) {
    console.log(project);
    this.dataService.getProjectService().getById(project.id).then(loadedProject=>{
      this.model.setProject(loadedProject);
      this.stageController.setProject(loadedProject);
    });
  }

  public getDateText(date: Date) {
    return DateFormatter.format(date);
  }

  public updateProject() {
    this.commandService.execute(new UpdateProjectCommand(this.model.getProject()));
  }

  public onRemoveStage(stage: Stage) {
    this.commandService.execute(new RemoveStageCommand(stage, this.model));
  }

  public closeView() {
    EventBus.getDefault().post(new ProjectDetailsCloseEvent(null));
  }

  public onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      this.changeStagesOrder(event.previousIndex, event.currentIndex);
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  private changeStagesOrder(previousIndex: number, currentIndex: number) {
    if (previousIndex == currentIndex) {
      return;
    }
    this.commandService.execute(new ChangeStageOrderCommand(currentIndex, previousIndex, this.model));
  }
}
