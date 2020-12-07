import { KanbanModel } from '../kanban.model';
import { FocusHelper } from 'app/shared/common/view_helper';
import { KanbanColumn } from 'app/database/shared/kanban-column/kanban-column';
import { RemoveColumnDialog } from '../dialog/kanban.remove-column';
import { DialogService } from 'app/ui/widgets/dialog/dialog.service';
import { CommandService } from 'app/commands/manager/command.service';
import { RemoveKanbanColumnCommand } from 'app/commands/data-command/kanban/command.remove-column';
import { UpdateColumnCommand } from 'app/commands/data-command/kanban/command.update-column';
import { CreateColumnCommand } from 'app/commands/data-command/kanban/command.create-column';

export class KanbanColumnController{

  constructor(private model: KanbanModel,private dialogService: DialogService, private commandService: CommandService){
  }

  public addColumn() {
    const columnName = this.model.getColumnName();
    if (!columnName || columnName == '') {
      this.model.setColumnNameValid(false);
      FocusHelper.focus('#new-column-input');
      return;
    }
    this.commandService.execute(new CreateColumnCommand(this.model));
  }

  public removeColumn(column: KanbanColumn) {
    RemoveColumnDialog.show(column, this.dialogService, ()=>{
      this.commandService.execute(new RemoveKanbanColumnCommand(column, this.model));
    });
  }

  public updateColumnName() {
    this.model.getEditedColumn().setName(this.model.getColumnName());
    this.commandService.execute(new UpdateColumnCommand(this.model.getEditedColumn(), this.model));
  }
}
