import { Subtask } from 'app/database/shared/subtask/subtask';
import { Task } from 'app/database/shared/task/task';
import { TasksList } from 'app/shared/common/lists/tasks.list';

export class TaskDetails {
  private task: Task = new Task();
  private subtasks: TasksList<Subtask> = new TasksList();
  // TODO: spróbować do odzdielnego pliku, w którym będą elementy potrzebne do wyświetlenia formularza

  public setSubtasks(subtasks: Subtask[]) {
    this.subtasks.setItems(subtasks);
  }

  public updateSubtasks(subtasks: Subtask[]) {
    this.subtasks.updateItems(subtasks);
    this.task.setSubtasks(this.subtasks.getAllItems());
  }

  public getFilteredSubtasks() {
    return this.subtasks.getItems();
  }

  public getAllSubtasks() {
    return this.subtasks.getAllItems();
  }

  public setTask(task: Task) {
    this.task = task;
    this.subtasks.setContainerId(task.getId());
    this.subtasks.setItems(task.getSubtasks());
  }

  public getTask(): Task {
    return this.task;
  }

  public toggleTaskImportance() {
    this.task.setImportant(!this.task.isImportant());
  }

  public getSubtaskByIndex(index: number) {
    return this.subtasks.getItemByIndex(index);
  }
}
