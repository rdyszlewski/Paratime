import { DataCommand } from 'app/commands/data-commnad';
import { KanbanModel } from 'app/tasks/tasks-container/kanban/kanban.model';

export class ChangeKanbanTaskOrderCommand extends DataCommand{

  constructor(private currentIndex, private previousIndex, private currentColumnId: string, private previousColumnId: string, private model: KanbanModel){
    super();
  }

  execute() {
    const currentColumn = this.model.getColumnById(Number.parseInt(this.currentColumnId));
    const previousColumn = this.model.getColumnById(Number.parseInt(this.previousColumnId));
    const previousTask = this.model.getTaskByIndex(
      this.previousIndex,
      previousColumn.id
    );
    const currentTask = this.model.getTaskByIndex(
      this.currentIndex,
      currentColumn.id
    );
    this._dataService.getKanbanTaskService().changeOrder(currentTask, previousTask, this.currentIndex, this.previousIndex).then(updatedTasks=>{
      this.model.updateTasks(updatedTasks, currentColumn.id);
      if(this.currentColumnId != this.previousColumnId){
        this.model.updateTasks(updatedTasks, previousColumn.id);
      }
    })
  }
  unExecute() {
    throw new Error('Method not implemented.');
  }
  getDescription(): string {
    return `Zmiana kolejności zadań kanban`;
  }

}
