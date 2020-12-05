import { DataService } from 'app/data.service';
import { KanbanModel } from '../kanban.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogHelper } from 'app/shared/common/dialog';
import { FocusHelper } from 'app/shared/common/view_helper';
import { KanbanColumn } from 'app/database/shared/kanban-column/kanban-column';

export class KanbanColumnController{

  constructor(private model: KanbanModel,private dialog: MatDialog, private dataService: DataService){
  }

  // ADDING
  public addColumn() {
    console.log(this.model.getColumnName());
    const columnName = this.model.getColumnName();
    if (!columnName || columnName == '') {
      this.model.setColumnNameValid(false);
      FocusHelper.focus('#new-column-input');
      return;
    }
    const kanbanColumn = new KanbanColumn();
    kanbanColumn.setDefault(false);
    kanbanColumn.setProjectId(this.model.getProject().getId());
    kanbanColumn.setName(this.model.getColumnName());

    this.dataService.getKanbanColumnService().create(kanbanColumn).then(result=>{
      this.model.addColumn(result.insertedElement);
      this.model.updateColumns(result.updatedElements);
      this.model.setColumnNameValid(true);
      this.model.closeAdddingColumn();
    });
  }

  // REMOVING
  public removeColumn(column: KanbanColumn) {
    const message = 'Czy na pewno usunąć kolumnę?';
    DialogHelper.openDialog(message, this.dialog).subscribe((result) => {
      if (result) {
        this.removeColumnFromStore(column);
      }
    });
  }

  private removeColumnFromStore(column: KanbanColumn) {
    this.dataService.getKanbanColumnService().remove(column).then(updatedColumns=>{
      this.model.updateColumns(updatedColumns);
    });
  }

  //RENAME
  public updateColumnName() {
    this.model.getEditedColumn().setName(this.model.getColumnName());
    this.dataService.getKanbanColumnService().update(this.model.getEditedColumn()).then(updatedColumn=>{
      this.model.updateColumns([updatedColumn]);
    });
  }
}
