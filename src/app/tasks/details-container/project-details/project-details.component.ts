import { Component, OnInit} from '@angular/core';
import { Project } from 'app/database/data/models/project';
import { ProjectType } from 'app/database/data/models/project_type';
import { Status } from 'app/database/data/models/status';
import { DataService } from 'app/data.service';
import { ProjectDetails } from './model/model';
import { Stage } from 'app/database/data/models/stage';
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
import { ProjectUpdateEvent } from './events/update.event';
import { ProjectDetailsCloseEvent } from './events/close.event';

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

  ngOnInit(): void {
    this.model = new ProjectDetails();
    this.state = new ProjectDetailsState(this.model);
    this.changeDetector = new ProjectChangeDetector(this.model);
    this.validator = new ProjectValidator(this.model);
    this.stageController = new ProjectStagesController(
      this.model
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
    this.model.setProject(project);
    this.stageController.setProject(project);
  }

  public getDateText(date: Date) {
    return DateFormatter.format(date);
  }

  public updateProject() {
    DataService.getStoreManager()
      .getProjectStore()
      .updateProject(this.model.getProject())
      .then(() => {
        EventBus.getDefault().post(new ProjectUpdateEvent(this.model.getProject()));
      });
  }

  public onRemoveStage(stage: Stage) {
    DataService.getStoreManager()
      .getStageStore()
      .removeStage(stage.getId())
      .then(updatedStages => {
        this.model.updateStages(updatedStages);
      });
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
    const previousStage = this.model.getStageByIndex(previousIndex);
    const currentStage = this.model.getStageByIndex(currentIndex);
    DataService.getStoreManager()
      .getStageStore()
      .move(previousStage, currentStage, previousIndex > currentIndex)
      .then((updatedStages) => {
        this.model.updateStages(updatedStages);
      });
  }
}