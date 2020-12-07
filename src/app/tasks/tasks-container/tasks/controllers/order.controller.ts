import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeTaskOrderCommand } from 'app/commands/data-command/task/command.change-task-order';
import { CommandService } from 'app/commands/manager/command.service';
import { Task } from 'app/database/shared/task/task';

export class TaskOrderController{

  public static onDrop(event:CdkDragDrop<string[]>, tasks: Task[], commandService: CommandService){
    if(event.previousContainer === event.container){
      commandService.execute(new ChangeTaskOrderCommand(event.currentIndex, event.previousIndex, tasks));
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }
}
