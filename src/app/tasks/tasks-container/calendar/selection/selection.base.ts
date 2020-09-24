import { Task } from 'app/database/data/models/task';
import { ITaskSelection } from './selection';

export abstract class TaskSelectionBase implements ITaskSelection{

  protected _selectedIds: Set<number> = new Set();
  protected _selectedTasks: Task[] = [];
  protected _lastSelected: Task;

  public selectTask(task: Task): void {
    if(this._selectedIds.has(task.getId())){
      this.deselectTask(task);
    } else {
      this.handleAddingTask(task);
      this.addSelectedTask(task);
    }
  }

  protected abstract handleAddingTask(task: Task);

  protected addSelectedTask(task: Task){
    this._selectedIds.add(task.getId());
    this._selectedTasks.push(task);
    this._lastSelected = task;
  }

  private deselectTask(task: Task){
    this._selectedIds.delete(task.getId());
    this.removeTask(task);
    if(task == this._lastSelected){
      this._lastSelected = null;
    }
  }

  private removeTask(task: Task){
    const index = this._selectedTasks.indexOf(task);
    this._selectedTasks.splice(index, 1);
  }

  public isSelected(task: Task): boolean {
    return this._selectedIds.has(task.getId());
  }

  public deselectAll(): void {
    this._selectedIds.clear();
    this._selectedTasks = [];
    this._lastSelected = null;
  }

  public selectMany(task: Task, list: Task[]) {
    const previousSelectedIndex = this._lastSelected? list.indexOf(this._lastSelected): 0;
    const currentSelectedIndex = list.indexOf(task);
    const firstIndex = previousSelectedIndex < currentSelectedIndex? previousSelectedIndex: currentSelectedIndex;
    const secondIndex = previousSelectedIndex < currentSelectedIndex? currentSelectedIndex: previousSelectedIndex;
    list.slice(firstIndex, secondIndex+1).forEach(item=>{
      this.handleAddingTask(item);
      this.addSelectedTask(item);
    });
    this._lastSelected = task;
  }

  public abstract getSelectedTasks(originalOrder: Task[]): Task[];

  public isManySelected(){
    return this._selectedTasks.length >= 2;
  }
}
