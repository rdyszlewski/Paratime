import { ITaskRepository } from './repositories/task_repository';
import { IProjectRepository } from './repositories/project_repository';
import { ISubtaskRepository } from './repositories/subtask_repository';
import { ILabelRepository } from './repositories/label_repository';
import { ITaskLabelsRepository } from './repositories/task_labels_repository';
import { IProjectStageRepository } from './repositories/stage_repository';
import { IPomodoroRepository } from './repositories/pomodoro_repository';
import { IKanbanColumnsRepository } from './repositories/kanban_columns_repository';
import { IKanbanTasksRepository } from './repositories/kanban_tasks_repository';

export interface IDataSource{
    getTaskRepository():ITaskRepository;
    getProjectRepository(): IProjectRepository;
    getSubtaskRepository():ISubtaskRepository;
    getLabelRepository(): ILabelRepository;
    getTaskLabelsRepository(): ITaskLabelsRepository;
    getStageRepository(): IProjectStageRepository;
    getPomodoroRepository(): IPomodoroRepository;
    getKanbanColumnsRepository(): IKanbanColumnsRepository;
    getKanbanTasksRepository(): IKanbanTasksRepository;
}