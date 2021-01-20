import { DataCommand } from "app/commands/data-commnad";
import { KanbanColumn } from "app/database/shared/kanban-column/kanban-column";
import { KanbanModel } from "app/tasks/tasks-container/kanban/kanban.model";

export class CreateColumnCommand extends DataCommand {

  constructor(private model: KanbanModel) {
    super();
  }

  execute() {
    const kanbanColumn = new KanbanColumn();
    kanbanColumn.default = false;
    kanbanColumn.projectId = this.model.getProject().id;
    kanbanColumn.name = this.model.getColumnName();

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
