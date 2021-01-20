import { DataCommand } from 'app/commands/data-commnad';
import { KanbanColumn } from 'app/database/shared/kanban-column/kanban-column';
import { KanbanModel } from 'app/tasks/tasks-container/kanban/kanban.model';

export class UpdateColumnCommand extends DataCommand{

  constructor(private column: KanbanColumn, private model: KanbanModel){
    super();
  }

  public execute() {
    this._dataService.getKanbanColumnService().update(this.model.getEditedColumn()).then(updatedColumn=>{
      this.model.updateColumns([updatedColumn]);
    });
  }

  unExecute() {
    throw new Error('Method not implemented.');
  }

  getDescription(): string {
    return `Aktualizacja kolumny ${this.column.name}`;
  }
}
