import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Status } from 'app/database/data/models/status';
import { TaskDetails } from './model/model';
import { Task } from 'app/database/data/models/task';
import { DataService } from 'app/data.service';
import { FocusHelper } from 'app/common/view_helper';
import { Priority } from 'app/database/data/models/priority';
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

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css'],
})
export class TaskDetailsComponent implements OnInit {
  private TASK_NAME_ID = '#task-name';

  @Output() closeEvent: EventEmitter<null> = new EventEmitter();
  @Output() saveEvent: EventEmitter<Task> = new EventEmitter();
  @Output() openLabelsEvent: EventEmitter<null> = new EventEmitter();

  public status = Status;
  public priority = Priority;

  private model: TaskDetails;
  private view: TaskDetailsView;
  private state: TaskViewState;
  private validator: TaskValidator;
  private changeDetector: TaskChangeDetector;
  private subtaskController: SubtasksController;
  private labelsController: TaskLabelsController;

  constructor() {}

  ngOnInit(): void {
    this.model = new TaskDetails();
    this.state = new TaskViewState(this.model);
    this.validator = new TaskValidator(this.model);
    this.changeDetector = new TaskChangeDetector(this.model);
    this.subtaskController = new SubtasksController(this.model);
    this.labelsController = new TaskLabelsController(this.model);
    this.view = new TaskDetailsView();
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
      DataService.getStoreManager()
        .getTaskStore()
        .update(this.model.getTask())
        .then(() => {});
    }
  }

  public closeView() {
    this.closeEvent.emit();
  }

  public openLabelsManager() {
    this.openLabelsEvent.emit();
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

  // TODO: przenieść to w jakieś inne miejsce. Połączyć ze zmianą kolejności w zadaniach
  private changeSubtasksOrder(previousIndex: number, currentIndex: number) {
    if (previousIndex == currentIndex) {
      return;
    }
    const previousTask = this.model.getSubtaskByIndex(previousIndex);
    const currentTask = this.model.getSubtaskByIndex(currentIndex);
    DataService.getStoreManager()
      .getSubtaskStore()
      .move(previousTask, currentTask, previousIndex > currentIndex)
      .then((updatedSubtasks) => {
        this.model.updateSubtasks(updatedSubtasks);
      });
  }
  // TODO: przerzucić to gdzieś
  public timeChange(time: string) {
    const values = time.split(':');
    const hours = Number.parseInt(values[0]);
    const minutes = Number.parseInt(values[1]);
    this.model.getTask().setTime(this.getTimeValue(hours, minutes));
    this.updateTask();
  }

  private getTimeValue(hour: number, minutes: number) {
    return hour * 60 + minutes;
  }

  public getTime(): string {
    const value = this.model.getTask().getTime();
    let hours;
    let minutes;
    if (value) {
      hours = Math.floor(value / 60);
      minutes = value % 60;
    } else {
      // TODO: tutaj można podać aktualną godzinę
      hours = 0;
      minutes = 0;
      // TODO: zrobić obsługe braku czasu w timepicker
    }
    return hours.toString() + ':' + minutes.toString();
  }
}
