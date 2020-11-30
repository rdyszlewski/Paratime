import { Hour } from "./day-model";

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
    setTimeout(() => {
      this.setCellsHeight(scale);
    }, 0);
    setTimeout(() => {
      this.calculateHeightOfTasks();
    });
  }

  private setCellsHeight(scale: number) {
    let baseHeight = this.calculateBaseCellHeight();
    let height = baseHeight * (scale / 100);
    this._hours.forEach((x) => (x.height = height));
    this._cellHeight = height;
    this._currentScale = scale;
  }

  private calculateBaseCellHeight() {
    let element = document.getElementById("5:00") as HTMLElement;
    let parentElement = element.parentElement;
    let parentHeight = parentElement.offsetHeight;
    let cellHeight = Math.floor(parentHeight / this._hours.length);
    return cellHeight;
  }

  private calculateHeightOfTasks() {
    this._hours.forEach((x) =>
      x.tasks.forEach((task) => {
        let cells = Math.ceil(task.task.getPlannedTime() / 10);
        let cellHeight = this._referenceCellElement.offsetHeight;
        let taskHeight = cells * cellHeight;
        task.size = taskHeight;
      }),
    );
  }
}
