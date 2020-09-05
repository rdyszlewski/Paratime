import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DataService } from 'app/data.service';
import { Task } from 'app/database/data/models/task';

export class TaskOrderController{

  public static onDrop(event:CdkDragDrop<string[]>, tasks: Task[]){
    if(event.previousContainer === event.container){
      this.changeTasksOrder(event.previousIndex, event.currentIndex, tasks);
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  private static changeTasksOrder(previousIndex: number, currentIndex: number, tasks:Task[]){
    // TODO: tutaj chyba powinny być chyba filtrowane
    const previousTask = tasks[previousIndex];
    const currentTask = tasks[currentIndex];
    return DataService.getStoreManager().getTaskStore().move(previousTask, currentTask, previousIndex> currentIndex);
  }
}
