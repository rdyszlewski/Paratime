import { Component, OnInit} from '@angular/core';

import { Task } from 'app/database/data/models/task';
import { Project } from 'app/database/data/models/project';
import { Status } from 'app/database/data/models/status';
import { TasksModel } from './model';
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
import { ITaskList } from '../task.list';
import { SpecialList } from 'app/tasks/lists-container/projects/common/special_list';
import { AppService } from 'app/core/services/app/app.service';
import { TaskRemoveEvent } from '../events/remove.event';
import { TasksService } from 'app/tasks/tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit, ITaskList {

  public status = Status;
  public taskType = TaskType;

  private model: TasksModel;
  private itemInfo: TaskItemInfo; // TODO: przerobić metody dostepowe
  private itemController: TaskItemController; // TODO: tutaj będzie trzeba zmienić nazwę
  private specialListsController: SpecialListTask; // TODO: to na razie zostawimy
  private addingController: TaskAddingController;
  private filteringController: TaskFilteringController;

  constructor(private appService: AppService, private tasksService: TasksService, private dataService: DataService) {
    this.model = new TasksModel();
    this.itemInfo = new TaskItemInfo();
    this.itemController = new TaskItemController();
    this.specialListsController = new SpecialListTask(this.model);
    this.addingController = new TaskAddingController(this.model, this.tasksService);
    this.filteringController = new TaskFilteringController(this.model, this.dataService);

    EventBus.getDefault().register(this);
  }

  close() {

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
    if (!project || project.getId() < 0) {
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
      this.model.setTasks(tasks);
      this.model.setTaskType(taskType);
      this.model.isOpen
    });
  }

  private loadProjectTasks(project: Project, taskType: TaskType) {
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

  // TODO: sprawdzić, czy to jest gdziekoleiek wykorzystywane
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
    this.tasksService.removeTask(task).then(updatedTasks=>{
      this.model.removeTask(task);
      this.model.updateTasks(updatedTasks as Task[]);
      EventBus.getDefault().post(new TaskRemoveEvent(task));
    })
  }

  public openDetails(task: Task): void {
    this.tasksService.openDetails(task);
  }

  public setActiveTask(task: Task){
    this.appService.setCurrentTask(task);
  }

  public removeActiveTask(){
    this.appService.setCurrentProject(null);
  }

  public isActiveTask(task: Task){
    return this.appService.isCurrentTask(task);
  }

  public finishTask(task:Task){
    this.tasksService.finishTask(task).then(updatedTasks=>{
      this.model.updateTasks(updatedTasks);
    });
  }

  // TODO: to może zostać przeniesione do ListsContainer. Trzeba będzie pobrać zadania i je ustawić
  @Subscribe("SpecialListEvent")
  public onSpecialListLoad(type: SpecialList){
    this.specialListsController.setSpecialList(type)
  }
}
