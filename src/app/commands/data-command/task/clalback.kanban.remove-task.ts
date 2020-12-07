import { KanbanTask } from 'app/database/shared/kanban-task/kanban-task';
import { TaskRemoveResult } from 'app/database/shared/task/task.remove-result';
import { KanbanModel } from 'app/tasks/tasks-container/kanban/kanban.model';
import { IRemoveTaskCallback } from './callback.remove-task';

export class RemoveKanbanTaskCallback implements IRemoveTaskCallback{

  constructor(private model: KanbanModel,private kanbanTask: KanbanTask){

  }

  execute(results: TaskRemoveResult[]) {
    results.forEach(result=>{
      this.model.updateTasks(result.updatedKanbanTasks, this.kanbanTask.getColumnId());
    });
  }

  unExecute() {
    throw new Error('Method not implemented.');
  }
}
