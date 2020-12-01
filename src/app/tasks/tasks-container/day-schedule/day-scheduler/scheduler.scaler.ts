import { Hour } from "./day-model";
import { TaskContainer } from './task-container';

export class DaySchedulerScaler {
  private _currentScale: number = 100;
  private _cellHeight: number = 6;
  private _referenceCellElement: HTMLElement;
  private _hours: Hour[];

  public get cellHeight(): number {
    return this._cellHeight;
  }

  public init(referenceCellElement: HTMLElement, hours: Hour[]) {
    this._referenceCellElement = referenceCellElement;
    this._hours = hours;
  }

  public scale(scale: number = this._currentScale) {
    if(!this._referenceCellElement){
      return;
    }
    setTimeout(() => {
      this.setCellsHeight(scale);
    }, 0);
    setTimeout(() => {
      this.calculateHeightOfTasks();
    });
  }

  private setCellsHeight(scale: number) {
    let baseHeight = this.calculateBaseCellHeight();
    let height = baseHeight * (scale / 100) - (scale/100 * 1 - 1);
    this._hours.forEach((x) => (x.height = height));
    this._cellHeight = height;
    this._currentScale = scale;
  }

  private calculateBaseCellHeight() {
    let cellHeight = Math.floor(this._referenceCellElement.offsetHeight / this._hours.length);
    return cellHeight;
  }

  private calculateHeightOfTasks() {
    this._hours.forEach(x =>this.scaleTasks(x.tasks));
  }

  public scaleTask(task: TaskContainer) {
    let cells = Math.ceil(task.getTime() / 10);
    let taskHeight = cells * this._cellHeight;
    task.size = taskHeight;
  }

  public scaleTasks(tasks: TaskContainer[]){
    tasks.forEach(task=>this.scaleTask(task));
  }
}
