import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { Task } from 'app/database/data/models/task';
import { Project } from 'app/database/data/models/project';
import { Status } from 'app/database/data/models/status';
import { TasksModel } from './model';
import { MatDialog } from '@angular/material/dialog';
import { TaskItemInfo } from './common/task.item.info';
import { TaskItemController } from './common/task.item.controller';
import { SpecialListTasks as SpecialListTask } from './common/special.list';
import { TaskFilteringController } from './filtering/task.filtering.controller';
import {
  CdkDragDrop,
} from '@angular/cdk/drag-drop';
import { DataService } from 'app/data.service';
import { TaskType } from './task.type';
import { ITaskContainer } from 'app/database/data/models/task.container';
import { TaskAddingController } from './adding/task.adding.controller';
import { TaskOrderController } from './controllers/order.controller';
import { Subscribe, EventBus } from 'eventbus-ts';
import { TaskDetailsEvent } from './events/details.event';
import { ITaskList } from '../task.list';
import { SpecialList } from 'app/tasks/lists-container/projects/common/special_list';
import { AppService } from 'app/core/services/app/app.service';
import { DialogHelper } from 'app/shared/common/dialog';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit, ITaskList {
  @Output() detailsEvent: EventEmitter<Task> = new EventEmitter();
  @Output() removeEvent: EventEmitter<number> = new EventEmitter();

  public status = Status;
  public taskType = TaskType;

  private model: TasksModel;
  private itemInfo: TaskItemInfo; // TODO: przerobić metody dostepowe
  private itemController: TaskItemController; // TODO: tutaj będzie trzeba zmienić nazwę
  private specialListsController: SpecialListTask; // TODO: to na razie zostawimy
  private addingController: TaskAddingController;
  private filteringController: TaskFilteringController;

  constructor(public dialog: MatDialog, private appService: AppService) {
    this.model = new TasksModel();
    this.itemInfo = new TaskItemInfo();
    this.itemController = new TaskItemController();
    this.specialListsController = new SpecialListTask(this.model);
    this.addingController = new TaskAddingController(this.model);
    this.filteringController = new TaskFilteringController(this.model);

    EventBus.getDefault().register(this);
  }

  ngOnInit(): void {}

  public getModel() {
    return this.model;
  }

  public getInfo() {
    return this.itemInfo;
  }

  public getItem() {
    return this.itemController;
  }

  public getSpecialList() {
    return this.specialListsController;
  }

  public getAdding() {
    return this.addingController;
  }

  public getFiltering() {
    return this.filteringController;
  }

  public openProject(project: Project): void {
    console.log("Otrzymano projekt");
    if (!project || project.getId() < 0) {
      console.log("Nieodpowiedni projekt");
      console.log(project);
      return;
    }
    this.model.setProject(project);
    this.loadTasks(TaskType.ACTIVE, project);
  }

  // TODO: to jest wykorzystywane w momencie pokazywania aktywnych i zakończonych zadań
  public loadTasks(taskType: TaskType, project = null) {
    const currentProject = project
      ? project
      : this.appService.getCurrentProject();
    this.loadProjectTasks(currentProject, taskType).then((tasks) => {
      console.log(tasks);
      this.model.setTasks(tasks);
      this.model.setTaskType(taskType);
      this.model.isOpen
    });
  }

  private loadProjectTasks(project: Project, taskType: TaskType) {
    console.log('loadProjectsTasks');
    switch (taskType) {
      case TaskType.ACTIVE:
        return DataService.getStoreManager()
          .getTaskStore()
          .getActiveTasks(project.getId());
      case TaskType.FINISHED:
        return DataService.getStoreManager()
          .getTaskStore()
          .getFinishedTasks(project.getId());
    }
  }

  public addTask(task: Task, container: ITaskContainer = null) {
    if (task.getProjectID() == this.model.getProject().getId()) {
      this.model.addTask(task);
    }
  }

  public onDrop(event: CdkDragDrop<string[]>) {
    TaskOrderController.onDrop(event, this.model.getTasks());
  }

  // MENU
  public menuClick(mouseEvent: MouseEvent, task: Task) {
    mouseEvent.stopPropagation();
  }

  public removeTask(task: Task): void {
    const message = 'Czy na pewno usunąć zadanie?';
    DialogHelper.openDialog(message, this.dialog).subscribe((result) => {
      if (result) {
        this.removeTaskTaskFromStore(task);
      }
    });
  }

  private removeTaskTaskFromStore(task: Task): void {
    DataService.getStoreManager()
      .getTaskStore()
      .removeTask(task.getId())
      .then((updatedTasks) => {
        this.model.removeTask(task);
        this.model.updateTasks(updatedTasks);
        this.removeEvent.emit(task.getId());
    });
  }

  public openDetails(task: Task): void {
    EventBus.getDefault().post(new TaskDetailsEvent(task));
  }

  public finishTask(task:Task){
    DataService.getStoreManager().getTaskStore().changeStatus(task, Status.ENDED).then(updatedTasks=>{
      this.model.updateTasks(updatedTasks);
    });
  }

  // TODO: to może zostać przeniesione do ListsContainer. Trzeba będzie pobrać zadania i je ustawić
  @Subscribe("SpecialListEvent")
  public onSpecialListLoad(type: SpecialList){
    this.specialListsController.setSpecialList(type)
  }
}
