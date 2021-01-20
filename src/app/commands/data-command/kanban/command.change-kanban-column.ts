import { DataCommand } from 'app/commands/data-commnad';
import { KanbanModel } from 'app/tasks/tasks-container/kanban/kanban.model';

export class ChangeKanbanColumnOrderCommand extends DataCommand{

  constructor(private currentIndex: number, private previousIndex: number,private model: KanbanModel){
    super();
  }

  public execute() {

    const previousColumn = this.model.getColumnByIndex(this.previousIndex);
    const currentColumn = this.model.getColumnByIndex(this.currentIndex);
    // TODO: może zrobić coś, co będzie sprawdzało, czy zdarzenie zostało wykoanene czy nie
    if (previousColumn.default || currentColumn.default) {
      return;
    }
    this._dataService.getKanbanColumnService().changeOrder(currentColumn, previousColumn, this.currentIndex, this.previousIndex).then(updatedColumns=>{
      this.model.updateColumns(updatedColumns);
    });
  }
  unExecute() {
    throw new Error('Method not implemented.');
  }

  getDescription(): string {
    return `Zmiana kolejności kolumn`;
  }

}
