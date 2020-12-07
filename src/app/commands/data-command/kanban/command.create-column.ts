import { DataCommand } from "app/commands/data-commnad";
import { KanbanColumn } from "app/database/shared/kanban-column/kanban-column";
import { KanbanModel } from "app/tasks/tasks-container/kanban/kanban.model";

export class CreateColumnCommand extends DataCommand {

  constructor(private model: KanbanModel) {
    super();
  }

  execute() {
    const kanbanColumn = new KanbanColumn();
    kanbanColumn.setDefault(false);
    kanbanColumn.setProjectId(this.model.getProject().getId());
    kanbanColumn.setName(this.model.getColumnName());

    this._dataService
      .getKanbanColumnService()
      .create(kanbanColumn)
      .then((result) => {
        this.model.addColumn(result.insertedElement);
        this.model.updateColumns(result.updatedElements);
        this.model.setColumnNameValid(true);
        this.model.closeAdddingColumn();
      });
  }
  unExecute() {
    throw new Error("Method not implemented.");
  }
  getDescription(): string {
    return `Tworzenie kolumny ${this.model.getColumnName()}`;
  }
}
