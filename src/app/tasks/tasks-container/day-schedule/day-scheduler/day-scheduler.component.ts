import { AfterViewInit, Component, OnInit, HostListener } from "@angular/core";
import { UpdateTaskCommand } from 'app/commands/data-command/task/command.update-task';
import { CommandService } from 'app/commands/manager/command.service';
import { DataService } from 'app/data.service';
import { Status } from "app/database/shared/models/status";
import { Task } from "app/database/shared/task/task";
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

  constructor(private dataService: DataService, private commandService: CommandService){

  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    setTimeout(() => {
      this._scaler.scale();
    });
  }

  ngAfterViewInit(): void {
    this.init();
  }

  public init(){
    let element = document.getElementsByClassName("day-schedule-view")[0] as HTMLElement;
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
    this._resizer = new SchedulerTaskResizer(this._scaler, container=>this.onTaskChanged(container));
    this._draggingController = new DraggingController(this._resizer, insertedTaskContainer=>this.onTaskChanged(insertedTaskContainer));
  }

  private onTaskChanged(taskContainer: TaskContainer){
    this.commandService.execute(new UpdateTaskCommand(taskContainer.task));
    this._scaler.scaleTask(taskContainer);
  }

  private initScheduler() {
    this._hours = SchedulerCreator.create(6, 6);
  }


  public setTasks(tasks: Task[]){
    this.clear();
    if(tasks!=null){
      let containers = this.initTasks(tasks);
      this._scaler.scaleTasks(containers);
    }
  }

  public getCells():string[]{
    return this._hours.map(x=>x.time);
  }

  public clear(){
    this._hours.forEach(x=>x.clearTasks());
  }

  private initTasks(tasks: Task[]): TaskContainer[] {
    if(!tasks){
      return [];
    }
    let containers: TaskContainer[] = [];
    tasks.forEach((task) => {
      let container = new TaskContainer(task);
      let time = task.startTime;
      let hour = Math.floor(time / 100);
      let minutes = time % 100;
      let hourElement = this.hours.find((x) => x.equal(hour, minutes));
      hourElement.addTask(container);
      containers.push(container);
    });
    return containers;
  }
}
