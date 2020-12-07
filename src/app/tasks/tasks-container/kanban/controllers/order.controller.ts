import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Task } from 'app/database/shared/task/task';
import { KanbanModel } from '../kanban.model';
import { CommandService } from 'app/commands/manager/command.service';
import { ChangeKanbanTaskOrderCommand } from 'app/commands/data-command/kanban/command.change-kanban-task-order';
import { ChangeKanbanColumnOrderCommand } from 'app/commands/data-command/kanban/command.change-kanban-column';

// TODO: sprawdzić, czy to jest gdzieś wykorzystywane
export class KanbanTaskOrderController {

  public static drop(event: CdkDragDrop<Task[]>, model: KanbanModel, commandService: CommandService) {
    if (event.previousContainer === event.container) {
      this.changeTasksOrder(event.container.id, event.previousIndex,
        event.currentIndex, model , commandService);
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.moveTaskToColumn(
        event.previousContainer.id,
        event.container.id,
        event.previousIndex,
        event.currentIndex,
        model,
        commandService
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
    commandService: CommandService
  ) {
    commandService.execute(new ChangeKanbanTaskOrderCommand(currentIndex, previousIndex, column,column, model));
  }

  private static moveTaskToColumn(
    previousColumnId: string,
    currentColumnId: string,
    previousIndex: number,
    currentIndex: number,
    model: KanbanModel,
    commandService: CommandService
  ) {
    commandService.execute(new ChangeKanbanTaskOrderCommand(currentIndex, previousIndex, currentColumnId, previousColumnId, model));
  }
}

export class KanbanColumnOrderController {
  public static drop(event: CdkDragDrop<Task[]>, model: KanbanModel, commandService: CommandService) {
    if (event.previousContainer === event.container) {
      this.changeColumnsOrder(event.previousIndex, event.currentIndex, model, commandService);
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
    commandService: CommandService
  ) {
    if (previousIndex == currentIndex) {
      return;
    }
    commandService.execute(new ChangeKanbanColumnOrderCommand(currentIndex, previousIndex, model));
  }
}
