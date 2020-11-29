import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Project } from 'app/database/data/models/project';
import { Task } from 'app/database/data/models/task';
import { ITaskContainer } from 'app/database/data/models/task.container';
import { ITaskItem } from 'app/database/data/models/task.item';
import { TasksList } from 'app/shared/common/lists/tasks.list';
import { ITaskList } from '../task.list';
import { CalendarDay } from './day';
import { TasksListComponent } from './tasks-list/tasks-list.component';

@Component({
  selector: 'day-schedule',
  templateUrl: './day-schedule.component.html',
  styleUrls: ['./day-schedule.component.css']
})
export class DayScheduleComponent implements OnInit, ITaskList, AfterViewInit {

  @ViewChild('current_day_tasks')
  private currentDayTasksComponent: TasksListComponent;

  @ViewChild('selected_day_tasks')
  private selectedDayTasksComponent: TasksListComponent;

  private _days: CalendarDay[];

  private _currentDay: Date;

  public get days(): CalendarDay[]{
    return this._days;
  }

  constructor() {
    // TODO: będzie konieczne odświeżać o określonej godzinie
    // TODO: najlepiej będzie, jeśli to będzie w jakieś innej klasie, wtedy będzie można korzystać z tego z różnych miejsc
    this._currentDay = new Date();
  }


  openProject(project: Project): void {
    // throw new Error('Method not implemented.');
  }

  removeTask(task: ITaskItem): void {
    throw new Error('Method not implemented.');
  }

  openDetails(task: ITaskItem): void {
    throw new Error('Method not implemented.');
  }

  // TODO: trzeba sprawdzić, czy na pewno to jest potrzebne. Możliwe, że coś z tego będzie można wyrzucić, po dodaniu komend
  addTask(container: ITaskContainer): void;

  addTask(task: ITaskItem, container: ITaskContainer): void;

  addTask(task: any, container?: any) {
    throw new Error('Method not implemented.');
  }

  close() {
    // throw new Error('Method not implemented.');
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.currentDayTasksComponent.initDropList("current-day", ["current-day"], (task: Task)=>{
        console.log(task);
      });
      this.selectedDayTasksComponent.initDropList("selected-day", ['specific-day'], (task: Task)=>{
        console.log("Zaznaczony dzień");
        console.log(task);
      });
    });
  }

  public isCurrentDay(day: CalendarDay){
    return (this._currentDay.getDate() == day.day &&
      this._currentDay.getMonth() == day.month &&
      this._currentDay.getFullYear() == day.year);
  }
  //
}
