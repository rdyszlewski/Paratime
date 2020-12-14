import { IKanbanColumnService } from "./kanban-column/kanban-column.service";
import { IKanbanTaskService } from "./kanban-task/kanban-task.service";
import { ILabelService } from "./label/label.service";
import { IPomodoroService } from "./pomodoro/pomodoro.service";
import { IProjectService } from "./project/project.service";
import { IProjectStageService } from "./stage/stage.service";
import { ISubtaskService } from "./subtask/subtask.service";
import { ITaskService } from "./task/task.service";

export interface IDataSource {
  getProjectService(): IProjectService;
  getTaskService(): ITaskService;
  getSubtaskService(): ISubtaskService;
  getLabelService(): ILabelService;
  getStageService(): IProjectStageService;
  getKanbanTaskService(): IKanbanTaskService;
  getKanbanColumnService(): IKanbanColumnService;
  getPomodoroService(): IPomodoroService;
}
