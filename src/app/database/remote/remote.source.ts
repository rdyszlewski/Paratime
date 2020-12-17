import { HttpClient } from "@angular/common/http";
import { InsertingTemplateComponent } from "app/tasks/shared/inserting-template/inserting-template.component";
import { IDataSource } from "../shared/data.source";
import { IKanbanColumnService } from "../shared/kanban-column/kanban-column.service";
import { IKanbanTaskService } from "../shared/kanban-task/kanban-task.service";
import { ILabelService } from "../shared/label/label.service";
import { IPomodoroService } from "../shared/pomodoro/pomodoro.service";
import { IProjectService } from "../shared/project/project.service";
import { IProjectStageService } from "../shared/stage/stage.service";
import { ISubtaskService } from "../shared/subtask/subtask.service";
import { ITaskService } from "../shared/task/task.service";
import { RemoteProjectService } from "./project/remote.project.service";

export class RemoteDataSource implements IDataSource{

  private readonly url = "http://localhost:8080/"
  // TODO: dodać tutaj wszystkie potrzebne rzeczy

  private projectService: IProjectService;

  constructor(private httpClient: HttpClient){
    this.projectService = new RemoteProjectService(httpClient, this.url);
  }

  getProjectService(): IProjectService {
    return this.projectService;
  }
  getTaskService(): ITaskService {
    throw new Error("Method not implemented.");
  }
  getSubtaskService(): ISubtaskService {
    throw new Error("Method not implemented.");
  }
  getLabelService(): ILabelService {
    return null;
  }
  getStageService(): IProjectStageService {
    throw new Error("Method not implemented.");
  }
  getKanbanTaskService(): IKanbanTaskService {
    throw new Error("Method not implemented.");
  }
  getKanbanColumnService(): IKanbanColumnService {
    throw new Error("Method not implemented.");
  }
  getPomodoroService(): IPomodoroService {
    throw new Error("Method not implemented.");
  }


}
