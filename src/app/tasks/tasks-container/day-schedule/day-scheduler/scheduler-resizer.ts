import { CdkDragMove } from "@angular/cdk/drag-drop";
import { DaySchedulerScaler } from "./scheduler.scaler";
import { TaskContainer } from "./task-container";

export class SchedulerTaskResizer {
  private _resizedTask: TaskContainer;

  constructor(private _scaler: DaySchedulerScaler, private resizeCallback: (container: TaskContainer)=>void) {}

  public dragMove(event: CdkDragMove<any>, taskContainer: TaskContainer) {
    this._resizedTask = taskContainer;
    let element = event.source.element.nativeElement;

    if (element.id.includes("top")) {
      this.moveTask(event, taskContainer);
      this.resize(event.distance, taskContainer, true);
    } else {
      this.resize(event.distance, taskContainer, false);
    }
  }

  private moveTask(event: CdkDragMove<any>, taskContainer: TaskContainer) {
    taskContainer.hide();
    let cellSize = this._scaler.cellHeight;
    let distanceY = event.distance["y"];
    let alignment = distanceY % cellSize;
    // distanceY -= alignment + cellSize
    distanceY -= alignment;
    distanceY -= cellSize;
    taskContainer.offset = distanceY;
  }

  private resize(distance, taskContainer: TaskContainer, top: boolean) {
    taskContainer.hide();
    let cellSize = this._scaler.cellHeight;
    let distanceY = distance["y"];
    let alignment = distanceY % cellSize;
    if (alignment != 0) {
      // distanceY -= alignment + (top? cellSize: -cellSize);
      distanceY -= alignment;
      if (top) {
        distanceY -= cellSize;
      } else {
        distanceY += cellSize;
      }
    }
    let orginalHeight = (taskContainer.getTime() / 10) * cellSize;
    // taskContainer.size = orginalHeight + (top? -distanceY: distanceY)
    if (top) {
      taskContainer.size = orginalHeight - distanceY;
    } else {
      taskContainer.size = orginalHeight + distanceY;
    }
  }

  public acceptResize() {
    let cellSize = this._scaler.cellHeight;
    let plannedTime = (this._resizedTask.size / cellSize) * 10;
    this._resizedTask.task.setPlannedTime(plannedTime);
    this._resizedTask.offset = 0;
    this._resizedTask.show();
    this.resizeCallback(this._resizedTask);
    this._resizedTask = null;
    // TODO: ustawienie czasu również powinno tutaj być
  }
}
