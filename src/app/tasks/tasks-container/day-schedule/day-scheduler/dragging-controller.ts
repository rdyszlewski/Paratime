import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { SchedulerTaskResizer } from "./scheduler-resizer";
import { TaskContainer } from "./task-container";

export class DraggingController {
  private _draggedTask: TaskContainer;

  constructor(private _resizer: SchedulerTaskResizer) {}

  public onDrop(event: CdkDragDrop<string[]>) {
    let id = event.item.element.nativeElement.id;
    if (id.includes("bottom") || id.includes("top")) {
      this._resizer.acceptResize();
    }
    if (id.includes("bottom")) {
      return;
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.updateStartTime(event);
    this._draggedTask.show();
    console.log("Pokazano");
    this._draggedTask = null;
  }

  private updateStartTime(event: CdkDragDrop<string[]>) {
    let timeId = event.container.element.nativeElement.id;
    let splitted = timeId.split(":");
    let timeValue = Number.parseInt(splitted[0]) * 100 + Number.parseInt(splitted[1]);
    this._draggedTask.task.setTime(timeValue);
  }

  public dragStarted(event: CdkDrag, taskContainer: TaskContainer) {
    console.log(event);
    console.log(taskContainer);
    this._draggedTask = taskContainer;
    // this._draggedTask.hide();
    console.log("Schowano");
  }
}
