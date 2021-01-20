import { Task } from 'app/database/shared/task/task';
import { TaskType } from './task.type';
import { TasksList } from 'app/shared/common/lists/tasks.list';
import { Values } from 'app/shared/common/values';
import { Project } from 'app/database/shared/project/project';

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
      return this.project.name;
    }
  }

  public setTasks(tasks: Task[], order=true) {
    if (tasks.length > 0) {
      this.tasks.setContainerId(tasks[0].containerId);
    }
    this.tasks.setItems(tasks, order);
  }

  public setProject(project: Project) {
    this.project = project;
    if (project) {
      this.tasks.setContainerId(project.id);
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
    (this.project.id >= 0 || this.project.id == Values.SPECIAL_LIST_ID);
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
