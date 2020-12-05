import { DataService } from "app/data.service";
import { TasksModel } from "../model";
import { SpecialList } from "app/tasks/lists-container/projects/common/special_list";
import { Values } from "app/shared/common/values";
import { TaskFilter } from "app/database/shared/task/task.filter";
import { Task } from "app/database/shared/task/task";
import { Project } from 'app/database/shared/project/project';

export class SpecialListTasks {
  private IMPORTANT_NAME = "Ważne";
  private TODAY_NAME = "Dzisiaj";

  constructor(private model: TasksModel, private dataService: DataService) {}

  public setSpecialList(listType: SpecialList) {
    switch (listType) {
      case SpecialList.IMPORTANT:
        this.loadImportantTasks();
        break;
      case SpecialList.TODAY:
        this.loadTodayTasks();
        break;
    }
  }

  private loadImportantTasks() {
    let filter = TaskFilter.getBuilder().setImportant(true).build();
    this.dataService
      .getTaskService()
      .getByFilter(filter)
      .then((tasks) => {
        this.createAndSetSpecialProject(this.IMPORTANT_NAME, tasks);
      });
  }

  private loadTodayTasks() {
    let filter = TaskFilter.getBuilder().setStartDate(new Date()).build();
    this.dataService
      .getTaskService()
      .getByFilter(filter)
      .then((tasks) => {
        this.createAndSetSpecialProject(this.TODAY_NAME, tasks);
      });
  }

  private createAndSetSpecialProject(name: string, tasks: Task[]): void {
    let project = this.createSpecialProject(name, tasks);
    this.model.setProject(project);
    this.model.setTasks(tasks, false);
  }

  private createSpecialProject(name: string, tasks: Task[]): Project {
    let project = new Project(name);
    project.setId(Values.SPECIAL_LIST_ID);
    project.setTasks(tasks);
    return project;
  }
}
