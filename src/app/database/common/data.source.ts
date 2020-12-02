import { IKanbanColumnService } from './kanban-column.service';
import { IKanbanTaskService } from './kanban-task.service';
import { ILabelService } from './label.service';
import { IPomodoroService } from './pomodoro.service';
import { IProjectService } from './project.service';
import { IProjectStageService } from './stage.service';
import { ISubtaskService } from './subtask.service';
import { ITaskService } from './task.service';

export interface IDataSource{
  getProjectService(): IProjectService;
  getTaskService(): ITaskService;
  getSubtaskService(): ISubtaskService;
  getLabelService(): ILabelService;
  getProjectStageService(): IProjectStageService;
  getKanbanTaskService(): IKanbanTaskService;
  getKanbanColumnService(): IKanbanColumnService;
  getPomodoroService(): IPomodoroService;
}
