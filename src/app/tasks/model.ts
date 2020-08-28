import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { TaskType } from './task.type';
import { TasksList } from 'app/common/lists/tasks.list';

export class TasksModel {
  private project: Project = new Project();
  private taskWithOpenMenu: Task;
  private tasks: TasksList<Task> = new TasksList();
  private taskType: TaskType = TaskType.ACTIVE;

  public getProject() {
    return this.project;
  }

  public getProjectName() {
    if (this.project) {
      return this.project.getName();
    }
  }

  public setTasks(tasks: Task[]) {
    if (tasks.length > 0) {
      this.tasks.setContainerId(tasks[0].getContainerId());
    }
    this.tasks.setItems(tasks);
  }

  public setProject(project: Project) {
    this.project = project;
    if (project) {
      this.tasks.setContainerId(project.getId());
    }
  }

  public getTasks(): Task[] {
    return this.tasks.getItems();
  }

  public addTask(task: Task) {
    this.project.addTask(task);
    this.tasks.addItem(task);
  }

  public updateTasks(tasks: Task[]) {
    this.tasks.updateItems(tasks);
  }

  public filterTasks(filter: string): void {
    this.tasks.filter(filter);
  }

  public removeTask(task: Task) {
    this.project.removeTask(task);
    this.tasks.removeItem(task);
  }

  public getTaskWithOpenMenu(): Task {
    return this.taskWithOpenMenu;
  }

  public setTaskWithOpenMenu(task: Task) {
    this.taskWithOpenMenu = task;
  }

  public isOpen(): boolean {
    return this.project != null &&
    (this.project.getId() >= 0 && this.project.getId() == 987); // 987 value for special lists
    // TODO: przenieść wartość do stałej
  }

  public getTaskByIndex(index: number): Task {
    return this.tasks.getItemByIndex(index);
  }

  public setTaskType(taskType: TaskType) {
    this.taskType = taskType;
  }

  public isActiveTaskType() {
    return this.taskType == TaskType.ACTIVE;
  }
}
