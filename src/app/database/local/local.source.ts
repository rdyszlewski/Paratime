import { IDataSource } from '../shared/data.source';
import { IKanbanColumnService } from '../shared/kanban-column/kanban-column.service';
import { IKanbanTaskService } from '../shared/kanban-task/kanban-task.service';
import { ILabelService } from '../shared/label/label.service';
import { IPomodoroService } from '../shared/pomodoro/pomodoro.service';
import { IProjectService } from '../shared/project/project.service';
import { IProjectStageService } from '../shared/stage/stage.service';
import { ISubtaskService } from '../shared/subtask/subtask.service';
import { ITaskService } from '../shared/task/task.service';
import { LocalDatabase } from './database';
import { LocalTaskLabelsRepository } from './label/local.task-labels.repository';
import { LocalTaskRepository } from './task/local.task.repository';
import { LocalKanbanColumnService } from './kanban-column/local.kanban-column.service';
import { LocalKanbanTaskService } from './kanban-task/local.kanban-task.service';
import { LocalLabelService } from './label/local.label.service';
import { LocalProjectService } from './project/local.project.service';
import { LocalProjectStageService } from './stage/local.stage.service';
import { LocalSubtaskService } from './subtask/local.subtask.service';
import { LocalTaskService } from './task/local.task.service';
import { LocalKanbanColumnRepository } from './kanban-column/local.kanban-column.repository';
import { LocalKanbanTaskRepository } from './kanban-task/local.kanban-task';
import { LocalLabelRepository } from './label/local.label.repository';
import { LocalProjectRepository } from './project/local.project.repository';
import { LocalProjectStageRepository } from './stage/local.stage.repository';
import { LocalSubtaskRepository } from './subtask/local.subtask.repository';
import { LocalPomodoroRepository } from './pomodoro/local.pomodoro.repository';
import { LocalPomodoroService } from './pomodoro/local.pomodoro.service';


export class LocalDataSource implements IDataSource{

  private projectService: IProjectService;
  private stageService: IProjectStageService;
  private taskService: ITaskService;
  private subtaskService: ISubtaskService;
  private labelService: ILabelService;
  private kanbanColumnService: IKanbanColumnService;
  private kanbanTaskService: IKanbanTaskService;
  private pomodoroService: IPomodoroService;


  constructor(){
    // TODO: zrobić tak, żeby przekazywać bazę danych, aby mozna było wstawiać testową bazę
    let database = new LocalDatabase();

    let projectRepository = new LocalProjectRepository(database.getProjectsTable());
    let stageRepository = new LocalProjectStageRepository(database.getStagesTable());
    let taskRepository = new LocalTaskRepository(database.getTasksTable());
    let labelRepository = new LocalLabelRepository(database.getLabelsTable());
    let taskLabelsRepository = new LocalTaskLabelsRepository(database.getTaskLabelsTable());
    let kanbanColumnRepository = new LocalKanbanColumnRepository(database.getKanbanColumnsTable());
    let subtaskRepository = new LocalSubtaskRepository(database.getSubtasksTable());
    let kanbanTaskRepository = new LocalKanbanTaskRepository(database.getKanbanTasksTable());
    let pomodoroRepository = new LocalPomodoroRepository(database.getPomodoroTable());

    this.stageService = new LocalProjectStageService(stageRepository);
    this.labelService = new LocalLabelService(labelRepository, taskLabelsRepository);
    this.subtaskService = new LocalSubtaskService(subtaskRepository);
    this.taskService = new LocalTaskService(taskRepository, kanbanTaskRepository, kanbanColumnRepository, this.subtaskService, this.labelService);
    this.kanbanTaskService = new LocalKanbanTaskService(taskRepository, kanbanTaskRepository, kanbanColumnRepository, this.subtaskService, this.labelService);
    this.kanbanColumnService = new LocalKanbanColumnService(kanbanColumnRepository, this.kanbanTaskService);
    this.projectService = new LocalProjectService(projectRepository, stageRepository, this.kanbanColumnService);
    this.pomodoroService = new LocalPomodoroService(pomodoroRepository);
  }

  public getProjectService(): IProjectService {
    return this.projectService;
  }

  public getTaskService(): ITaskService {
    return this.taskService;
  }

  public getSubtaskService(): ISubtaskService {
    return this.subtaskService;
  }

  public getLabelService(): ILabelService {
    return this.labelService;
  }

  public getStageService(): IProjectStageService {
    return this.stageService;
  }

  public getKanbanTaskService(): IKanbanTaskService {
    return this.kanbanTaskService;
  }

  public getKanbanColumnService(): IKanbanColumnService {
    return this.kanbanColumnService;
  }

  public getPomodoroService(): IPomodoroService {
    return this.pomodoroService;
  }

}
