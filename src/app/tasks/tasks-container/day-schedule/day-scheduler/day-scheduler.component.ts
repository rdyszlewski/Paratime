import { AfterViewInit, Component, OnInit, HostListener } from "@angular/core";
import { Status } from "app/database/data/models/status";
import { Task } from "app/database/data/models/task";
import { Hour } from "./day-model";
import { DraggingController } from "./dragging-controller";
import { SchedulerCreator } from "./scheduler-creator";
import { SchedulerTaskResizer } from "./scheduler-resizer";
import { DaySchedulerScaler } from "./scheduler.scaler";
import { TaskContainer } from "./task-container";

@Component({
  selector: "app-day-scheduler",
  templateUrl: "./day-scheduler.component.html",
  styleUrls: ["./day-scheduler.component.css"],
})
export class DaySchedulerComponent implements OnInit, AfterViewInit {
  private _hours: Hour[];
  private _scaler: DaySchedulerScaler;
  private _resizer: SchedulerTaskResizer;
  private _draggingController: DraggingController;

  public get hours(): Hour[] {
    return this._hours;
  }

  public get resizer(): SchedulerTaskResizer {
    return this._resizer;
  }

  public get dragginController(): DraggingController {
    return this._draggingController;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    console.log("Resize");
    setTimeout(() => {
      this._scaler.scale();
    });
  }

  ngAfterViewInit(): void {
    let element = document.getElementById("5:00") as HTMLElement;
    this._scaler.init(element, this._hours);
    this._scaler.scale();
  }

  public changeScale(event) {
    let scale = event.target.value;
    this._scaler.scale(scale);
  }

  ngOnInit(): void {
    this.initComponents();
    this.initScheduler();
  }

  private initComponents() {
    this._scaler = new DaySchedulerScaler();
    this._resizer = new SchedulerTaskResizer(this._scaler);
    this._draggingController = new DraggingController(this._resizer);
  }

  private initScheduler() {
    this._hours = SchedulerCreator.create(6, 6);
    let tasks = this.createTasksTest();
    this.initTasks(tasks);
  }

  private createTasksTest(): Task[] {
    let task1 = new Task("Jeden", "", Status.STARTED);
    task1.setId(1);
    task1.setTime(900);
    task1.setPlannedTime(150);

    let task2 = new Task("Dwa", "", Status.STARTED);
    task2.setId(2);
    task2.setTime(1500);
    task2.setPlannedTime(50);

    return [task1, task2];
  }

  private initTasks(tasks: Task[]) {
    tasks.forEach((task) => {
      let container = new TaskContainer(task);
      let time = task.getTime();
      let hour = time / 100;
      let minutes = time % 100;
      let hourElement = this.hours.find((x) => x.equal(hour, minutes));
      hourElement.addTask(container);
    });
  }
}
