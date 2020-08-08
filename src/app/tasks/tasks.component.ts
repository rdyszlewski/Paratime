import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { Status } from 'app/models/status';
import { TasksModel } from './model';
import { MatDialog } from '@angular/material/dialog';
import { TaskItemInfo } from './common/task.item.info';
import { TaskItemController } from './common/task.item.controller';
import { SpecialListTaks as SpecialListTask } from './common/special.list';
import { ItemMenuController } from './common/item.menu.controller';
import { TaskAddingController } from './adding/task.adding.controller';
import { TaskFilteringController } from './filtering/task.filtering.controller';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop"
import { DataService } from 'app/data.service';
import { OrderController } from 'app/common/order/order.controller';
import { AppService } from 'app/services/app/app.service';

export enum TaskType{
  ACTIVE,
  FINISHED
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  @Output() detailsEvent: EventEmitter<Task> = new EventEmitter();
  @Output() removeEvent: EventEmitter<number> = new EventEmitter();
  @Output() pomodoroEvent: EventEmitter<Task> = new EventEmitter();
  public status = Status;
  public taskType = TaskType;

  private model: TasksModel;
  private itemInfo: TaskItemInfo;
  private itemController: TaskItemController;
  private specialListsController: SpecialListTask;
  private menuController: ItemMenuController;
  private addingController: TaskAddingController;
  private filteringController: TaskFilteringController;

  private orderController:OrderController<Task> = new OrderController();

  constructor(public dialog:MatDialog, private appService: AppService) {
    this.model = new TasksModel();
    this.itemInfo = new TaskItemInfo();
    this.itemController = new TaskItemController();
    this.specialListsController = new SpecialListTask(this.model);
    this.menuController = new ItemMenuController(this.model, this.detailsEvent, this.removeEvent, this.pomodoroEvent, this.dialog);
    this.addingController = new TaskAddingController(this.model);
    this.filteringController = new TaskFilteringController(this.model);
  }

  public getModel(){
    return this.model;
  }

  public getInfo(){
    return this.itemInfo;
  }

  public getItem(){
    return this.itemController;
  }

  public getSpecialList(){
    return this.specialListsController;
  }

  public getMenu(){
    return this.menuController;
  }

  public getAdding(){
    return this.addingController;
  }

  public getFiltering(){
    return this.filteringController;
  }

  ngOnInit(): void {
  }

  public addTask(task:Task){
    if(task.getProjectID()==this.model.getProject().getId()){
      this.model.addTask(task);
    }
  }

  onDrop(event:CdkDragDrop<string[]>){
    if(event.previousContainer === event.container){
      this.changeTasksOrder(event.previousIndex, event.currentIndex);
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  private changeTasksOrder(previousIndex: number, currentIndex: number){
    const tasksToUpdate = this.orderController.move(previousIndex, currentIndex, this.model.getTasks());
    this.updateTasks(tasksToUpdate).then(()=>{
      // TODO: sprawdzić, czy to jest ok
      this.updateTasksInView(tasksToUpdate);
    });
  }

  private updateTasks(tasks:Task[]){
     const promises = [];
     tasks.forEach(task=>{
       promises.push(this.updateTask(task));
     })
     return Promise.all(promises);
  }

  private updateTasksInView(tasks:Task[]){
    this.model.updateTasks(tasks);
  }

  private updateTask(task:Task){
    DataService.getStoreManager().getTaskStore().updateTask(task).then(updatedTask=>{
      // TODO: można zrobić jakieś działania po zaktualizowaniu zadań albo wyświetlić komunikat
    });
  }

  public openProject(project:Project):void{
    this.appService.setCurrentProject(project);
    this.model.setProject(project);
    this.loadTasks(TaskType.ACTIVE, project);
  }

  public loadTasks(taskType: TaskType, project=null){
    const currentProject = project? project : this.appService.getCurrentProject();
    this.loadProjectTasks(currentProject, taskType).then(tasks=>{
      this.model.setTasks(tasks);
      this.model.setTaskType(taskType);
    });
  }

  private loadProjectTasks(project: Project, taskType: TaskType){
    switch(taskType){
      case TaskType.ACTIVE:
        return DataService.getStoreManager().getTaskStore().getActiveTasks(project.getId());
      case TaskType.FINISHED:
        return DataService.getStoreManager().getTaskStore().getFinishedTasks(project.getId());
    }
  }
}

