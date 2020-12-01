import { AfterViewInit, Component, HostListener, OnInit, Predicate, ViewChild } from '@angular/core';
import { DataService } from 'app/data.service';
import { Project } from 'app/database/data/models/project';
import { Task } from 'app/database/data/models/task';
import { ITaskContainer } from 'app/database/data/models/task.container';
import { ITaskItem } from 'app/database/data/models/task.item';
import { TasksList } from 'app/shared/common/lists/tasks.list';
import { filter } from 'rxjs/operators';
import { ITaskList } from '../task.list';
import { CalendarDay } from './day';
import { DaySchedulerComponent } from './day-scheduler/day-scheduler.component';
import { ICalendarCallback } from './mini-calendar/calendar-callback';
import { MiniCalendarComponent } from './mini-calendar/mini-calendar.component';
import { TasksListComponent } from './tasks-list/tasks-list.component';

@Component({
  selector: 'day-schedule',
  templateUrl: './day-schedule.component.html',
  styleUrls: ['./day-schedule.component.css']
})
export class DayScheduleComponent implements OnInit, ITaskList, AfterViewInit {

  @ViewChild(MiniCalendarComponent)
  private calendarComponent: MiniCalendarComponent;

  @ViewChild('current_day_tasks')
  private currentDayTasksComponent: TasksListComponent;

  @ViewChild('selected_day_tasks')
  private selectedDayTasksComponent: TasksListComponent;

  @ViewChild(DaySchedulerComponent)
  private daySchedulerComponent: DaySchedulerComponent;

  private _days: CalendarDay[];
  private _project: Project;

  private _currentDay: Date;

  public get days(): CalendarDay[]{
    return this._days;
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event){
    event.preventDefault();
  }

  constructor() {
    // TODO: będzie konieczne odświeżać o określonej godzinie
    // TODO: najlepiej będzie, jeśli to będzie w jakieś innej klasie, wtedy będzie można korzystać z tego z różnych miejsc
    this._currentDay = new Date();
  }


  openProject(project: Project): void {
    console.log("Otwieranie projektu");
    this._project = project;
    this.daySchedulerComponent.init();
    this.calendarComponent.callbacks = new CalendarCallback(this._project, this.currentDayTasksComponent, this.selectedDayTasksComponent);
    // TODO: wyświetlenie zadań na liscie
    // TODo: załadowanie dzisiejszego dnia
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
    // this.calendarComponent.callbacks = {
    //   onLeftClick(day: CalendarDay){
    //     console.log("Kliknięcie");
    //     // TODO: załadowanie zadań bez godziny
    //     // TODO: załadowanie zadań z godziną
    //     // TODO: zadania bez godziny wyświetlić na liście
    //     // TODO: zadania z wyświetlić na planie dnia
    //   },
    //   onRightClick(day: CalendarDay){
    //     console.log(day);
    //   }
    // };
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

class CalendarCallback implements ICalendarCallback{

  constructor(private project: Project, private currentDayTasks: TasksListComponent, private selectedDayTasks: TasksListComponent){}

  onLeftClick(day: CalendarDay) {
    // this.initTasks(day);
    this.loadTasks(day, this.currentDayTasks,
      [this.getProjectPredicate(),
        task=>task.getTime==null]);
  }


  onRightClick(day: CalendarDay) {
    this.loadTasks(day, this.selectedDayTasks, [this.getProjectPredicate()]);
  }

  private loadTasks(day:CalendarDay, listComponent: TasksListComponent, predicates: Predicate<Task>[],){
    let date = new Date(day.year, day.month, day.day);
    DataService.getStoreManager().getTaskStore().getTasksByDate(date).then(tasks=>{
      let resultTasks = tasks;
      predicates.forEach(predicate=>{
        resultTasks = resultTasks.filter(predicate);
      })
      listComponent.tasks = resultTasks;
    });
  }

  private getProjectPredicate(): Predicate<Task>{
    return task=>task.getProject().getId() == this.project.getId();
  }
}
