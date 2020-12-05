import { Task } from 'app/database/shared/task/task';
import { TaskSelectionBase } from './selection.base';

export class VariousTaskSelection extends TaskSelectionBase{

  protected handleAddingTask(task: Task) {
    // do nothing
  }

  public getSelectedTasks(originalOrder: Task[]): Task[] {
    return this._selectedTasks;
  }
}
