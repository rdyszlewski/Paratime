import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  Predicate,
  ViewChild,
} from "@angular/core";
import { DataService } from "app/data.service";
import { Project } from "app/database/data/models/project";
import { Task } from "app/database/data/models/task";
import { ITaskContainer } from "app/database/data/models/task.container";
import { ITaskItem } from "app/database/data/models/task.item";
import { TaskFilter } from 'app/database/filter/task.filter';
import { ITaskList } from "../task.list";
import { CalendarDay } from "./day";
import { DaySchedulerComponent } from "./day-scheduler/day-scheduler.component";
import { ICalendarCallback } from "./mini-calendar/calendar-callback";
import { MiniCalendarComponent } from "./mini-calendar/mini-calendar.component";
import { TasksListComponent } from "./tasks-list/tasks-list.component";

@Component({
  selector: "day-schedule",
  templateUrl: "./day-schedule.component.html",
  styleUrls: ["./day-schedule.component.css"],
})
export class DayScheduleComponent implements OnInit, ITaskList, AfterViewInit {
  @ViewChild(MiniCalendarComponent)
  private calendarComponent: MiniCalendarComponent;

  @ViewChild("current_day_tasks")
  private currentDayTasksComponent: TasksListComponent;

  @ViewChild("selected_day_tasks")
  private selectedDayTasksComponent: TasksListComponent;

  @ViewChild(DaySchedulerComponent)
  private daySchedulerComponent: DaySchedulerComponent;

  private _days: CalendarDay[];
  private _project: Project;

  private _currentDay: Date;

  private _specificDayOpen:boolean = false;

  public get specificDayOpen():boolean{
    return this._specificDayOpen;
  }

  public get days(): CalendarDay[] {
    return this._days;
  }

  @HostListener("contextmenu", ["$event"])
  onRightClick(event) {
    event.preventDefault();
  }

  constructor(private dataService: DataService) {
    // TODO: będzie konieczne odświeżać o określonej godzinie
    // TODO: najlepiej będzie, jeśli to będzie w jakieś innej klasie, wtedy będzie można korzystać z tego z różnych miejsc
    this._currentDay = new Date();
  }

  openProject(project: Project): void {
    // TODO: w którym miejscu ładowane są zdania
    this.daySchedulerComponent.clear();
    this._project = project;
    this.daySchedulerComponent.init();
    this.calendarComponent.callbacks = new CalendarCallback(
      this._project,
      this.currentDayTasksComponent,
      this.selectedDayTasksComponent,
      this.daySchedulerComponent,
      ()=>{
        this._specificDayOpen = !this._specificDayOpen;
      },
      this.dataService
    );
  }

  removeTask(task: ITaskItem): void {
    throw new Error("Method not implemented.");
  }

  openDetails(task: ITaskItem): void {
    throw new Error("Method not implemented.");
  }

  // TODO: trzeba sprawdzić, czy na pewno to jest potrzebne. Możliwe, że coś z tego będzie można wyrzucić, po dodaniu komend
  addTask(container: ITaskContainer): void;

  addTask(task: ITaskItem, container: ITaskContainer): void;

  addTask(task: any, container?: any) {
    throw new Error("Method not implemented.");
  }

  close() {
    // throw new Error('Method not implemented.');
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.currentDayTasksComponent.initDropList("current-day",
      this.daySchedulerComponent.getCells().concat(["current-day", "selected-day"]),
       (task: Task) => {
         // TODO: uzupełnić to
        console.log(task);
      });
      this.selectedDayTasksComponent.initDropList(
        "selected-day",
        this.daySchedulerComponent.getCells().concat(["selected-day", "current-day"]),
        (task: Task) => {
          // TODO: uzupełnić to
          console.log("Zaznaczony dzień");
          console.log(task);
        },
      );
    });
  }

  public isCurrentDay(day: CalendarDay) {
    return (
      this._currentDay.getDate() == day.day &&
      this._currentDay.getMonth() == day.month &&
      this._currentDay.getFullYear() == day.year
    );
  }

  public closeSpecificDayTasks(){
    this._specificDayOpen = false;
  }
}

class CalendarCallback implements ICalendarCallback {
  // TODO: sprawdzić, czy to będzie potrzebnme
  constructor(
    private project: Project,
    private currentDayTasks: TasksListComponent,
    private selectedDayTasks: TasksListComponent,
    private scheduler: DaySchedulerComponent,
    private openSpecificCallback: ()=>void,
    private dataService: DataService
  ) {}

  onLeftClick(day: CalendarDay) {
    this.loadSchedulerTasks(day, this.project.getId(),false, this.currentDayTasks);
    this.loadTasks(day, this.project.getId(), true).then(tasks=>{
      this.scheduler.setTasks(tasks);
    });
  }

  onRightClick(day: CalendarDay) {
    // this.loadListTasks(day, this.selectedDayTasks, [this.getProjectPredicate()]);
    this.loadSchedulerTasks(day, this.project.getId(),null, this.selectedDayTasks);
    this.openSpecificCallback();
  }

  private loadSchedulerTasks(day: CalendarDay, projectId: number, withTime: boolean, listComponent: TasksListComponent){
    this.loadTasks(day, projectId, withTime).then(tasks=>{
      listComponent.tasks = tasks;
    })
  }

  private loadTasks(day: CalendarDay, projectId: number, withTime: boolean):Promise<Task[]>{
    let date = new Date(day.year, day.month, day.day);
    let filter = TaskFilter.getBuilder().setProject(projectId).setStartDate(date).setHasStartTime(withTime).build();
    console.log("loadChedulerTasks2");
    return this.dataService.getTaskService().getByFilter(filter)
  }
}
