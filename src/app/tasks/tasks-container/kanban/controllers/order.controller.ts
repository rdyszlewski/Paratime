import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Task } from 'app/database/shared/task/task';
import { DataService } from 'app/data.service';
import { KanbanModel } from '../kanban.model';

// TODO: sprawdzić, czy to jest gdzieś wykorzystywane
export class KanbanTaskOrderController {

  public static drop(event: CdkDragDrop<Task[]>, model: KanbanModel, dataService: DataService) {
    if (event.previousContainer === event.container) {
      this.changeTasksOrder(event.container.id, event.previousIndex,
        event.currentIndex, model , dataService);
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.moveTaskToColumn(
        event.previousContainer.id,
        event.container.id,
        event.previousIndex,
        event.currentIndex,
        model,
        dataService
      );
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  private static changeTasksOrder(
    column: string,
    previousIndex: number,
    currentIndex: number,
    model: KanbanModel,
    dataService: DataService
  ) {
    const currentColumn = model.getColumnById(Number.parseInt(column));
    const previousTask = model.getTaskByIndex(
      previousIndex,
      currentColumn.getId()
    );
    const currentTask = model.getTaskByIndex(
      currentIndex,
      currentColumn.getId()
    );
    dataService.getKanbanTaskService().changeOrder(currentTask, previousTask, currentIndex, previousIndex).then(updatedTasks=>{
      model.updateTasks(updatedTasks, currentColumn.getId())
    })
  }

  private static moveTaskToColumn(
    previousColumnId: string,
    currentColumnId: string,
    previousIndex: number,
    currentIndex: number,
    model: KanbanModel,
    dataService: DataService
  ) {
    const previousColumn = model.getColumnById(
      Number.parseInt(previousColumnId)
    );
    const currentColumn = model.getColumnById(Number.parseInt(currentColumnId));
    const previousTask = model.getTaskByIndex(
      previousIndex,
      previousColumn.getId()
    );
    let currentTask = model.getTaskByIndex(currentIndex, currentColumn.getId());
    if (previousTask == currentTask) {
      currentTask = null;
    }

    dataService.getKanbanTaskService().changeColumn(previousTask, currentTask, currentColumn.getId()).then(updatedTasks=>{
      model.updateTasks(updatedTasks, currentColumn.getId());
      model.updateTasks(updatedTasks, previousColumn.getId());
    });
  }
}

export class KanbanColumnOrderController {
  public static drop(event: CdkDragDrop<Task[]>, model: KanbanModel, dataService: DataService) {
    if (event.previousContainer === event.container) {
      this.changeColumnsOrder(event.previousIndex, event.currentIndex, model, dataService);
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  private static changeColumnsOrder(
    previousIndex: number,
    currentIndex: number,
    model: KanbanModel,
    dataService: DataService
  ) {
    if (previousIndex == currentIndex) {
      return;
    }
    const previousColumn = model.getColumnByIndex(previousIndex);
    const currentColumn = model.getColumnByIndex(currentIndex);
    if (previousColumn.isDefault() || currentColumn.isDefault()) {
      return;
    }
    dataService.getKanbanColumnService().changeOrder(currentColumn, previousColumn, currentIndex, previousIndex).then(updatedColumns=>{
      model.updateColumns(updatedColumns);
    });
  }
}
