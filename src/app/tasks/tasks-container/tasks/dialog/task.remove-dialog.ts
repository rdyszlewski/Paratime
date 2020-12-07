import { Task } from 'app/database/shared/task/task';
import { DialogService } from 'app/ui/widgets/dialog/dialog.service';

export class TaskRemoveDialog{

  public static showSingleRemoveQuestion(task: Task, dialogService: DialogService, action: ()=>void){
    let message = `Czy na pewno usunąć zadanie ${task.getName()}?`;
    dialogService.openQuestion(message, action);
  }

  public static showManyRemoveQuestion(tasks: Task[], dialogService: DialogService, action: ()=>void){
    let message = `Czy na pewno usunąć wiele zadań (${tasks.length})?`;
    dialogService.openQuestion(message, action);
  }
}
