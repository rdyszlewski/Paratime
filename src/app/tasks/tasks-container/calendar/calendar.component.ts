import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from 'app/core/services/app/app.service';
import { DataService } from 'app/data.service';
import { Project } from 'app/database/data/models/project';
import { Task } from 'app/database/data/models/task';
import { ITaskContainer } from 'app/database/data/models/task.container';
import { ITaskItem } from 'app/database/data/models/task.item';
import { ListHelper } from 'app/shared/common/lists/list.helper';
import { DialogModel } from 'app/tasks/creating-dialog/dialog.model';
import { CreatingDialogHelper } from 'app/tasks/creating-dialog/helper';
import { TasksService } from 'app/tasks/tasks.service';
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

  public readonly WITHOUT_DATE = "withoutDate";
  public  readonly CURRENT_TASKS = "currentTasks";

  private _project: Project;
  private _month: number;
  private _year: number;

  private _cells: TaskDay[];
  private _tasksWithoutDate = [];

  private _showWithoutDate = true;
  private _selectedDay: TaskDay;
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
    return this._selectedDay;
  }

  public get showCurrentTasks():boolean{
    return this._showCurrentTasks;
  }

  constructor(private appService: AppService, private tasksService: TasksService, private dialog: MatDialog) {}

  public openProject(project: Project): void {
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

  public removeTask(task: ITaskItem): void {
    this.tasksService.removeTask(task).then(updatedTasks=>{
      if(updatedTasks != null){
        this.removeTaskFromDay(task as Task);
      }
    });
  }

  private removeTaskFromDay(task: Task){
    if(task.getDate() != null){
      const cell =this._cells.find(x=>this.isCorrectCell(x, task));
      if(cell){
        ListHelper.remove(task, cell.tasks);
      } else {
        if(this._selectedDay && this.isCorrectCell(this._selectedDay, task)){
          ListHelper.remove(task, this._selectedDay.tasks);
        }
      }
    } else {
      ListHelper.remove(task, this._tasksWithoutDate);
    }
  }

  private isCorrectCell(x: TaskDay, task: Task): unknown {
    return x.month == task.getDate().getMonth() && x.day == task.getDate().getDate() && x.year == task.getDate().getFullYear();
  }

  public openDetails(task: Task): void {
    this.tasksService.openDetails(task);
  }

  public showAddingTaskDialog(){
    // TODO: wyskoczenie okienka z polem do wpisaniem nazwy
    // TODO: akceptowanie nazwy -> wykonanie metody addTask
  }



  // TODO: zastanowić się, czy to powinno wyglądać w ten sposób. Czy to daje nam jakieś korzyści
  public addTask(task:ITaskItem, container: ITaskContainer=null): void{
    // TODO: pokazać okienko ze wstawianiem nowej daty

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
    return 'cell_' + cell.day + '_' + cell.month + "_" + cell.year;
  }

  public getCellNames() {
    const cellNames = [];
    this._cells.forEach((x) => {
      cellNames.push(this.getCellName(x));
    });
    cellNames.push(this.WITHOUT_DATE);
    cellNames.push(this.CURRENT_TASKS);
    return cellNames;
  }

  public taskDrop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      this.changeDate(task, event.container.id);
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  private changeDate(task: Task, cellName: string) {
    switch(cellName){
      case this.WITHOUT_DATE:
        task.setDate(null);
        break;
      case this.CURRENT_TASKS:
        const currentCell = this.getCellName(this._selectedDay);
        this.changeDate(task, currentCell);
        break;
      default:
        this.changeTaskDate(task, cellName);
    }
    DataService.getStoreManager().getTaskStore().update(task);
  }

  private changeTaskDate(task:Task, cellName: string){
    const cellParts = cellName.split('_');
      const day = Number.parseInt(cellParts[1]);
      const month = Number.parseInt(cellParts[2]);
      const year = Number.parseInt(cellParts[3]);
      const newDate = new Date(year, month, day);
      task.setDate(newDate);
  }

  public toggleShowWithoutDate() {
    this._showWithoutDate = !this._showWithoutDate;
  }

  public toggleShowCurrentTasks(){
    this._showCurrentTasks = !this._showCurrentTasks;
  }

  public getCurrentTasks(){
    if(this._selectedDay){
      return this._selectedDay.tasks;
    }
    return [];
  }

  public setSelectedDay(day: TaskDay){
    this._selectedDay = day;
    console.log(day);
  }

  public getSelectedDate(){
    if(this._selectedDay){
      return this._selectedDay.day + "." +this._selectedDay.month;
    }
    return "";
  }

  public menuClick(mouseEvent: MouseEvent, task: Task) {
    mouseEvent.stopPropagation();
  }

  public setActiveTask(task:Task){
    this.appService.setCurrentTask(task);
  }

  public isActiveTask(task:Task): boolean{
    return this.appService.getCurrentTask() == task;
  }

  public removeActiveTask(){
    this.appService.setCurrentTask(null);
  }

  public finishTask(task: Task){
    this.tasksService.finishTask(task).then(updatedTasks=>{
      // TODO: zastanowić się i zaktualizować widok
    });
  }

  public openCreatingDialog(cell: TaskDay){
    const data = new DialogModel("", this._project, this.getDate(cell), model=>{
      if(model){
        this.tasksService.addTask(model.name, model.project, null, model.date).then(result=>{
          cell.tasks.push(result.insertedTask);
        });
      }
    });
    CreatingDialogHelper.openDialog(data, this.dialog);
    return false;
  }

  private getDate(cell: TaskDay){
    return new Date(cell.year, cell.month, cell.day);
  }
}
