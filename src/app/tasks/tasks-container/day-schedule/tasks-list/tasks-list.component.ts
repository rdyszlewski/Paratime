import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/data.service';
import { Status } from 'app/database/data/models/status';
import { Task } from 'app/database/data/models/task';
import { IDraggingController } from './draggine-controller';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit {

  private _title: string;
  private _id: string="";
  private _tasks: Task[] = [];
  private _connectedLists: string[] = [];
  private _onDrop: (task: Task)=>void;
  private _dragginController: IDraggingController;

  public get title(): string{
    return this._title;
  }

  public set title(value: string){
    this._title = value;
  }

  public get id(): string{
    return this._id;
  }

  public get tasks(): Task[]{
    return this._tasks;
  }

  public set tasks(value: Task[]){
    this._tasks = value;
  }

  public get connectedLists(): string[]{
    return this._connectedLists;
  }

  public get onDrop(): (task: Task) => void{
    return this._onDrop;
  }

  public get draggingController(): IDraggingController{
    return this._dragginController;
  }

  public set draggingController(controller: IDraggingController){
    this._dragginController = controller;
  }

  constructor(private dataService: DataService) {
  }

  public initDropList(id: string, connectedLists: string[], onDrop: (task: Task)=>void){
    this._id = id;
    this._connectedLists = connectedLists;
    this._onDrop = onDrop;
  }

  ngOnInit(): void {
    // this.addTestTasks();

  }

  private addTestTasks(){
    let task1 = new Task("Jeden", "", Status.STARTED);
    let task2 = new Task("Dwa", "", Status.STARTED);
    let task3 = new Task("Trzy", "", Status.STARTED);
    this.tasks.push(task1, task2, task3);
  }
}
