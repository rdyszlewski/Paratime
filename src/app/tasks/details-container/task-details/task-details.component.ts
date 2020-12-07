import { Component, OnInit} from '@angular/core';
import { Status } from 'app/database/shared/models/status';
import { TaskDetails } from './model/model';
import { Task } from 'app/database/shared/task/task';
import { DataService } from 'app/data.service';
import { Priority } from 'app/database/shared/task/priority';
import { TaskViewState } from './model/state';
import { TaskValidator } from './model/validator';
import { TaskChangeDetector } from './model/change.detector';
import { SubtasksController } from './subtasks/subtasks.editing.controller';
import { TaskLabelsController } from './labels/task.labels.controller';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TaskDetailsView } from './subtask.view';
import { FocusHelper } from 'app/shared/common/view_helper';
import { EventBus } from 'eventbus-ts';
import { TaskDetailsCloseEvent } from './events/close.event';
import { OpenLabelsManagerEvent } from './events/open.labels.event';
import { CommandService } from 'app/commands/manager/command.service';
import { UpdateTaskCommand } from 'app/commands/data-command/task/command.update-task';
import { ChangeSubtaskOrderCommand } from 'app/commands/data-command/subtask/command.change-subtask-order';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css'],
})
export class TaskDetailsComponent implements OnInit {
  private TASK_NAME_ID = '#task-name';

  public status = Status;
  public priority = Priority;

  private model: TaskDetails;
  private view: TaskDetailsView;
  private state: TaskViewState;
  private validator: TaskValidator;
  private changeDetector: TaskChangeDetector;
  private subtaskController: SubtasksController;
  private labelsController: TaskLabelsController;

  constructor(private dataService: DataService, private commandService: CommandService) {}

  ngOnInit(): void {
    this.model = new TaskDetails();
    this.state = new TaskViewState(this.model);
    this.validator = new TaskValidator(this.model);
    this.changeDetector = new TaskChangeDetector(this.model);
    this.subtaskController = new SubtasksController(this.model, this.commandService);
    this.labelsController = new TaskLabelsController(this.model, this.dataService, this.commandService);
    this.view = new TaskDetailsView(this.dataService);
  }

  public getModel(): TaskDetails {
    return this.model;
  }

  public getView():TaskDetailsView{
    return this.view;
  }

  public getState(): TaskViewState {
    return this.state;
  }

  public getValidator(): TaskValidator {
    return this.validator;
  }

  public getChangeDetector(): TaskChangeDetector {
    return this.changeDetector;
  }

  public getSubtask(): SubtasksController {
    return this.subtaskController;
  }

  public getLabels(): TaskLabelsController {
    return this.labelsController;
  }

  public setTask(task: Task) {
    if (task) {
      this.model.setTask(task);
      this.view.init(task.getProjectID());
      this.subtaskController.setTask(task);
      FocusHelper.focus(this.TASK_NAME_ID);
    }
  }

  public updateTask() {
    if (this.validator.isValid()) {
      this.commandService.execute(new UpdateTaskCommand(this.model.getTask()));
    }
  }

  public closeView() {
    EventBus.getDefault().post(new TaskDetailsCloseEvent(null));
  }

  public openLabelsManager() {
    EventBus.getDefault().post(new OpenLabelsManagerEvent(null));
  }

  // return amount of subtask with status FINISHED
  public getFinishedSubtasks(task: Task) {
    let finishedSubtask = task
      .getSubtasks()
      .filter((x) => x.getStatus() == Status.ENDED);
    return finishedSubtask.length;
  }

  public toggleTaskImportance() {
    this.model.toggleTaskImportance();
    this.updateTask();
  }

  public onDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      this.changeSubtasksOrder(event.previousIndex, event.currentIndex);
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

  private changeSubtasksOrder(previousIndex: number, currentIndex: number) {
    if (previousIndex == currentIndex) {
      return;
    }
    this.commandService.execute(new ChangeSubtaskOrderCommand(currentIndex, previousIndex, this.model));
  }
  // TODO: przerzucić to gdzieś
  public timeChange(time: string) {
    const values = time.split(':');
    const hours = Number.parseInt(values[0]);
    const minutes = Number.parseInt(values[1]);
    this.model.getTask().setStartTime(this.getTimeValue(hours, minutes));
    this.updateTask();
  }

  private getTimeValue(hour: number, minutes: number) {
    return hour * 100 + minutes;
  }

  public getTime(): string {
    const value = this.model.getTask().getStartTime();
    let hours;
    let minutes;
    if (value) {
      hours = Math.floor(value / 100);
      minutes = value % 100;
    } else {
      // TODO: tutaj można podać aktualną godzinę
      hours = 0;
      minutes = 0;
      // TODO: zrobić obsługe braku czasu w timepicker
    }
    // TODO: prawdopodobnie potrzebne będzie tutaj jakieś formatowanie
    let result = hours.toString() + ":" + minutes.toString();
    return result;
  }
}
