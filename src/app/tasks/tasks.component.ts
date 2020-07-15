import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { Status } from 'app/models/status';
import { TasksModel } from './model';
import { DataService } from 'app/data.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogHelper } from 'app/common/dialog';
import { Priority } from 'app/models/priority';
import { SpecialList } from 'app/projects/common/special_list';
import { TaskItemInfo } from './common/task.item.info';
import { TaskItemController } from './common/task.item.controller';
import { SpecialListTaks as SpecialListTask } from './common/special.list';
import { ItemMenuController } from './common/item.menu.controller';
import { TaskAddingController } from './adding/task.adding.controller';
import { TaskFilteringController } from './filtering/task.filtering.controller';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  
  @Output() detailsEvent: EventEmitter<Task> = new EventEmitter();
  @Output() removeEvent: EventEmitter<number> = new EventEmitter();
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
    this.menuController = new ItemMenuController(this.model, this.detailsEvent, this.removeEvent, this.dialog);
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

}
