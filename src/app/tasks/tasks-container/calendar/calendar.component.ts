import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FixedSizeVirtualScrollStrategy } from '@angular/cdk/scrolling';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/data.service';
import { Project } from 'app/database/data/models/project';
import { Task } from 'app/database/data/models/task';
import { ITaskContainer } from 'app/database/data/models/task.container';
import { ITaskItem } from 'app/database/data/models/task.item';
import { ITaskList } from '../task.list';
import { TaskDay } from './task.day';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, ITaskList{

  private _project: Project;
  private _month: number;
  private _year: number;

  private _cells: TaskDay[];

  public get month():number{
    return this._month;
  }

  public get year(): number{
    return this._year;
  }

  public get cells():TaskDay[]{
    return this._cells;
  }

  constructor() { }

  openProject(project: Project): void {
    console.log("Otwieranie projektu");
    this._project = project;
    this.setCurrentDate();
    this.createCalendar(this._month, this._year);
    this.loadTasks();
  }

  private setCurrentDate(){
    const date = new Date();
    this._month = date.getMonth();
    this._year = date.getFullYear();
  }

  private loadTasks(){
    const firstCell = this._cells[0];
    const lastCell = this._cells[this._cells.length-1];
    // TODO: tutaj rozwiązać problem z latami
    const firstDate = new Date(this._year, firstCell.month, firstCell.day);
    const lastDate = new Date(this._year, lastCell.month, lastCell.month);
    DataService.getStoreManager().getTaskStore().getTasksByDate(firstDate, lastDate).then(tasks=>{
      console.log(tasks);
      this.setupTasks(tasks);
    })
  }

  removeTask(task: ITaskItem): void {
    throw new Error('Method not implemented.');
  }

  openDetails(task: ITaskItem): void {
    throw new Error('Method not implemented.');
  }
  addTask(container: ITaskContainer): void;
  addTask(task: ITaskItem, container: ITaskContainer): void;
  addTask(task: any, container?: any) {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    // this.poligon();
    this.setCurrentDate();
    this.createCalendar(this._month, this.year);

    const tasks = this.createTasks();
    this.setupTasks(tasks);
  }


  private createTasks(){
    const task1Date = new Date(2020, 8, 12);
    const task1 = new Task("Zadanie 1"," Siema");
    task1.setDate(task1Date);

    const task2Date = new Date(2020, 8, 5);
    const task2 = new Task("Zadanie 2", "To jest zadanie 2");
    task2.setDate(task2Date);

    const task3 = new Task("Zadanie 3", " Zadanie 3");
    task3.setDate(task1Date);

    const tasks = [task1, task2, task3];
    return tasks;
  }

  private setupTasks(tasks: Task[]){
    if(!this._project){
      return;
    }
    tasks.filter(x=>x.getProjectID()==this._project.getId()).forEach(task=>{
      const date = task.getDate();
      const day = this._cells.find(x=>x.day == date.getDate() && x.month == x.month);
      if(day){
        day.tasks.push(task);
      }
    });
  }

  private createCalendar(month: number, year: number){
    const date = new Date(year,month, 1);
    console.log(date);
    // TODO: trzeba odpowiednio ustawić datę
    const previousDate = new Date(year, month, 0);

    this._cells = [];
    const firstDay = this.getDateOfWeek(date);
    console.log(firstDay);
    const previousLastDay = previousDate.getDate();
    for(let i = previousLastDay - firstDay + 1; i < previousLastDay+1; i++){
      this._cells.push(new TaskDay(i, month - 1, false));
    }

    const lastDate = new Date(year, month + 1, 0);
    console.log(lastDate);
    const lastDay = lastDate.getDate();
    for(let i = 1; i < lastDay +1; i++ ){
      this._cells.push(new TaskDay(i, month, true));
    }

    // TODO: pobrać dni, które są później
    const lastDayNumber = this.getDateOfWeek(lastDate);
    for(let i =1; i< 7- lastDayNumber; i++){
      this._cells.push(new TaskDay(i, month + 1, false));
    }

    if(this._cells.length != 42){
      for(let i = 7 - lastDayNumber;  i< 14 - lastDayNumber; i++){
        this._cells.push(new TaskDay(i, month + 1, false));
      }
    }
  }

  private getDateOfWeek(date: Date){
    const number = date.getDay() - 1;
    return number >= 0? number : 6;
  }

  public increaseMonth(){
    this._month += 1;
    if(this._month > 11){
      this._month = 0;
      this._year += 1;
    }
    this.createCalendar(this._month, this.year);
  }

  public decreaseMonth(){
    this._month -= 1;
    if(this._month < 0){
      this._month = 11;
      this._year -=1;
    }
    this.createCalendar(this._month, this._year);
  }

  public increaseYear(){
    this._year += 1;
    this.createCalendar(this._month, this._year);
  }

  public decreaseYear(){
    this._year -= 1;
    this.createCalendar(this._month, this._year);
  }

  public getCellName(cell: TaskDay){
    return "cell_"+cell.day+"_"+cell.month;
  }

  public getCellNames(){
    const cellNames = [];
    this._cells.forEach(x=>{
      cellNames.push(this.getCellName(x));
    });
    return cellNames;
  }

  public taskDrop(event: CdkDragDrop<Task[]>) {
    console.log("Siema");
    if (event.previousContainer === event.container) {
      // TODO:
      console.log("Przestawiam");
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log("Zmieniam ");
      console.log(event.container);

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
