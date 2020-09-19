import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/data.service';
import { Project } from 'app/database/data/models/project';
import { Task } from 'app/database/data/models/task';
import { ITaskContainer } from 'app/database/data/models/task.container';
import { ITaskItem } from 'app/database/data/models/task.item';
import { ITaskList } from '../task.list';
import { CalendarCreator } from './calendar/calendar.creator';
import { TaskLoader } from './calendar/task.loader';
import { TaskDay } from './task.day';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit, ITaskList {
  private _project: Project;
  private _month: number;
  private _year: number;

  private _cells: TaskDay[];
  private _tasksWithoutDate = [];

  private _showWithoutDate = true;
  private _currentDay: TaskDay;
  private _showCurrentTasks = true;

  public get month(): number {
    return this._month;
  }

  public get year(): number {
    return this._year;
  }

  public get cells(): TaskDay[] {
    return this._cells;
  }

  public get tasksWithoutDate(): Task[] {
    return this._tasksWithoutDate;
  }

  public get showWithDate(): boolean {
    return this._showWithoutDate;
  }

  public get currentDay(): TaskDay {
    return this._currentDay;
  }

  public get showCurrentTasks():boolean{
    return this._showCurrentTasks;
  }

  constructor() {}

  openProject(project: Project): void {
    this._project = project;
    this.setCurrentDate();
    this.createCalendar();
  }

  private setCurrentDate() {
    const date = new Date();
    this._month = date.getMonth();
    this._year = date.getFullYear();
  }

  private loadTasks() {
    TaskLoader.loadTasks(this._cells, this._project, this._year).then(
      (result) => {
        this._cells = result.cells;
        this._tasksWithoutDate = result.tasksWithoutDate;
        console.log(this._tasksWithoutDate);
      }
    );
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
    this.setCurrentDate();
    this.createCalendar();
  }

  private createCalendar() {
    this._cells = CalendarCreator.createCalendar(this._month, this.year);
    this.loadTasks();
  }

  public increaseMonth() {
    this._month += 1;
    if (this._month > 11) {
      this._month = 0;
      this._year += 1;
    }
    this.createCalendar();
  }

  public decreaseMonth() {
    this._month -= 1;
    if (this._month < 0) {
      this._month = 11;
      this._year -= 1;
    }
    this.createCalendar();
  }

  public increaseYear() {
    this._year += 1;
    this.createCalendar();
  }

  public decreaseYear() {
    this._year -= 1;
    this.createCalendar();
  }

  public getCellName(cell: TaskDay) {
    return 'cell_' + cell.day + '_' + cell.month;
  }

  public getCellNames() {
    const cellNames = [];
    this._cells.forEach((x) => {
      cellNames.push(this.getCellName(x));
    });
    cellNames.push('withoutDate');
    cellNames.push('currentTasks');
    return cellNames;
  }

  public taskDrop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      this.changeDate(task, event.container.id);

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  private changeDate(task: Task, cellName: string) {
    // TODO: w przypadku przeciągania dlo obecnych zadań, wrzucić do odpowiedniej daty
    if (cellName == 'withoutDate') {
      task.setDate(null);
    } else if(cellName == "currentTasks"){
      const currentCell = this.getCellName(this._currentDay);
      this.changeDate(task, currentCell);
    }
    else {
      this.changeTaskDate(task, cellName);
    }
    DataService.getStoreManager().getTaskStore().update(task);
  }

  private changeTaskDate(task:Task, cellName: string){
    const cellParts = cellName.split('_');
      // TODO: tutaj będzie trzeba uważać na rok
      const cell = this._cells.find(
        (x) =>
          x.day == Number.parseInt(cellParts[1]) &&
          x.month == Number.parseInt(cellParts[2])
      );
      const day = Number.parseInt(cellParts[1]);
      const month = Number.parseInt(cellParts[2]);
      // TODO: czy to na pewno jest konieczne
      if (cell) {
        const newDate = new Date(this._year, month, day);
        task.setDate(newDate);
      }
  }

  public toggleShowWithoutDate() {
    this._showWithoutDate = !this._showWithoutDate;
  }

  public toggleShowCurrentTasks(){
    this._showCurrentTasks = !this._showCurrentTasks;
  }

  public getCurrentTasks(){
    if(this._currentDay){
      return this._currentDay.tasks;
    }
    return [];
  }

  public setCurrentDay(day: TaskDay){
    this._currentDay = day;
  }
}
