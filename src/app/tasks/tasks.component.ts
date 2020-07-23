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
  
  private model: TasksModel;
  private itemInfo: TaskItemInfo;
  private itemController: TaskItemController;
  private specialListsController: SpecialListTask;
  private menuController: ItemMenuController;
  private addingController: TaskAddingController;
  private filteringController: TaskFilteringController; 
  

  constructor(public dialog:MatDialog) { 
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

  public setProject(project:Project):void{
    this.model.setProject(project);
  }

  public addTask(task:Task){
    if(task.getProjectID()==this.model.getProject().getId()){
      this.model.addTask(task);
    }
  }

  onDrop(event:CdkDragDrop<string[]>){
    console.log("Położono to tutaj");
    if(event.previousContainer === event.container){
      this.replaceTasksOrder(event.previousIndex, event.currentIndex);
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  private replaceTasksOrder(previousIndex: number, currentIndex: number) {
    const task1 = this.model.getTaskByIndex(previousIndex);
    const task2 = this.model.getTaskByIndex(currentIndex);
    const prevTask1 = this.model.getTaskByOrderPrev(task1.getId());
    const prevTask2 = this.model.getTaskByOrderPrev(task2.getId());
    if (prevTask1) {
      prevTask1.setOrderPrev(task2.getId());
      this.updateTask(prevTask1);
    }
    if (prevTask2) {
      prevTask2.setOrderPrev(task1.getId());
      this.updateTask(prevTask2);
    }
    const prev = task1.getOrderPrev();
    task1.setOrderPrev(task2.getOrderPrev());
    task1.setOrderPrev(task2.getOrderPrev());
    task2.setOrderPrev(prev);

    this.updateTask(task1);
    this.updateTask(task2);
  }

  private updateTask(task:Task){
    DataService.getStoreManager().getTaskStore().updateTask(task).then(updatedTask=>{
      // TODO: można zrobić jakieś działania po zaktualizowaniu zadań
    });
  }

  

}
