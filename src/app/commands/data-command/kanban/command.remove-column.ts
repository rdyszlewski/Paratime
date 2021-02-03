import { DataCommand } from 'app/commands/data-commnad';
import { KanbanColumn } from 'app/database/shared/kanban-column/kanban-column';
import { KanbanModel } from 'app/tasks/tasks-container/kanban/kanban.model';

export class RemoveKanbanColumnCommand extends DataCommand{

  constructor(private column: KanbanColumn, private model: KanbanModel){
    super();
  }

  execute() {
    this._dataService.getKanbanColumnService().remove(this.column).then(updatedColumns=>{
      this.model.updateColumns(updatedColumns);
    })
  }

  unExecute() {
    throw new Error('Method not implemented.');
  }

  getDescription(): string {
    return `Usuwanie kolumny ${this.column.name}`;
  }
}
