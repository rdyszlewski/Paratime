import { KanbanColumn } from 'app/database/data/models/kanban';

export class InsertColumnResult{

  private _insertedColumn: KanbanColumn;
  private _updatedColumns: KanbanColumn[];

  public get insertedColumn(): KanbanColumn {
    return this._insertedColumn;
  }
  public set insertedColumn(value: KanbanColumn) {
    this._insertedColumn = value;
  }

  public get updatedColumns(): KanbanColumn[] {
    return this._updatedColumns;
  }
  public set updatedColumns(value: KanbanColumn[]) {
    this._updatedColumns = value;
  }
}
