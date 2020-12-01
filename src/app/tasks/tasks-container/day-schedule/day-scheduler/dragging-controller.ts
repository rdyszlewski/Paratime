import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { Task } from "app/database/data/models/task";
import { SchedulerTaskResizer } from "./scheduler-resizer";
import { TaskContainer } from "./task-container";

export class DraggingController {
  private _draggedTask: TaskContainer;

  // TODO: można zmienic nazwę callbacku
  constructor(private _resizer: SchedulerTaskResizer, private insertTaskCallback: (task:TaskContainer)=>void) {}

  public onDrop(event: CdkDragDrop<TaskContainer[]>) {
    let id = event.item.element.nativeElement.id;
    if (id.includes("bottom") || id.includes("top")) {
      this._resizer.acceptResize();
    }
    if (id.includes("bottom")) {
      return;
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      // this._draggedTask.show();
      this._draggedTask = null;
    } else {
      if (this.dragFromScheduler(event)) {
        this.moveFromAnotherHour(event);
      } else {
        this.transferFromAnotherList(event);
        // TODO: to powinno być teraz przeskalowane
      }
    }
  }

  private moveFromAnotherHour(event: CdkDragDrop<TaskContainer[], TaskContainer[]>) {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    this.updateStartTime(event.container.element.nativeElement.id, this._draggedTask);
    this.insertTaskCallback(this._draggedTask);
  }

  private transferFromAnotherList(event: CdkDragDrop<TaskContainer[], TaskContainer[]>) {
    let task = event.item.dropContainer.data[event.previousIndex];
    let container = new TaskContainer(task as Task);
    event.previousContainer.data.splice(event.previousIndex, 1);
    event.container.data.push(container);
    this.updateStartTime(event.container.element.nativeElement.id, container);
    this.insertTaskCallback(container);
  }

  private dragFromScheduler(event: CdkDragDrop<TaskContainer[], TaskContainer[]>) {
    return !event.item.dropContainer.data[event.previousIndex];
  }

  private updateStartTime(timeId: string, taskContainer: TaskContainer) {
    let splitted = timeId.split(":");
    let timeValue = Number.parseInt(splitted[0]) * 100 + Number.parseInt(splitted[1]);
    taskContainer.task.setTime(timeValue);
  }

  public dragStarted(event: CdkDrag, taskContainer: TaskContainer) {
    this._draggedTask = taskContainer;
    // this._draggedTask.hide();
  }
}
