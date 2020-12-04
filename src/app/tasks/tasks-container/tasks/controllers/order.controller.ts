import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DataService } from 'app/data.service';
import { Task } from 'app/database/data/models/task';

export class TaskOrderController{

  public static onDrop(event:CdkDragDrop<string[]>, tasks: Task[], dataService: DataService){
    if(event.previousContainer === event.container){
      this.changeTasksOrder(event.previousIndex, event.currentIndex, tasks, dataService);
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  private static changeTasksOrder(previousIndex: number, currentIndex: number, tasks:Task[], dataService: DataService){
    const previousTask = tasks[previousIndex];
    const currentTask = tasks[currentIndex];
    return dataService.getTaskService().changeOrder(currentTask, previousTask, currentIndex, previousIndex);
  }
}
