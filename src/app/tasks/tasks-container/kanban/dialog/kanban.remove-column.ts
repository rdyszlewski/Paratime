import { KanbanColumn } from 'app/database/shared/kanban-column/kanban-column';
import { DialogService } from 'app/ui/widgets/dialog/dialog.service';

export class RemoveColumnDialog{

  public static show(column: KanbanColumn, dialogService: DialogService, action: ()=>void){
    const message = `Czy na pewno usunąć kolumnę ${column.getName()}?  Wszystkie znajdujące się na niej zadania również zostaną usunięte`;
    dialogService.openQuestion(message, action);
  }
}
