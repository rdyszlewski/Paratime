import { FocusHelper } from 'app/common/view_helper';
import { KanbanColumn } from 'app/data/models/kanban';
import { DataService } from 'app/data.service';
import { KanbanModel } from '../kanban.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogHelper } from 'app/common/dialog';

export class KanbanColumnController{

  private model: KanbanModel;
  private dialog: MatDialog;

  constructor(model: KanbanModel, dialog: MatDialog){
    this.model = model;
    this.dialog = dialog;
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

    DataService.getStoreManager()
      .getKanbanColumnStore()
      .create(kanbanColumn)
      .then((result) => {
        this.model.addColumn(kanbanColumn);
        this.model.updateColumns(result.updatedColumns);
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
    // TODO: zastanowić się, czy przenieść wszystkie zadania do nieprzypisanych, czy usunąć
    DataService.getStoreManager()
      .getKanbanColumnStore()
      .remove(column.getId())
      .then((updatedColumns) => {
        this.model.updateColumns(updatedColumns);
      });
  }

  //RENAME
  public updateColumnName() {
    this.model.getEditedColumn().setName(this.model.getColumnName());
    DataService.getStoreManager()
      .getKanbanColumnStore()
      .update(this.model.getEditedColumn());
  }
}
