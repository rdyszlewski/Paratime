import { IDataSource } from '../common/data.source';
import { IKanbanColumnService } from '../common/kanban-column.service';
import { IKanbanTaskService } from '../common/kanban-task.service';
import { ILabelService } from '../common/label.service';
import { IPomodoroService } from '../common/pomodoro.service';
import { IProjectService } from '../common/project.service';
import { IProjectStageService } from '../common/stage.service';
import { ISubtaskService } from '../common/subtask.service';
import { ITaskService } from '../common/task.service';
import { LocalDatabase } from './database';
import { LocalKanbanColumnRepository } from './repository/local.kanban-column.repository';
import { LocalLabelRepository } from './repository/local.label.repository';
import { LocalProjectRepository } from './repository/local.project.repository';
import { LocalProjectStageRepository } from './repository/local.stage.repository';
import { LocalSubtaskRepository } from './repository/local.subtask.repository';
import { LocalTaskLabelsRepository } from './repository/local.task-labels.repository';
import { LocalTaskRepository } from './repository/local.task.repository';
import { LocalKanbanColumnService } from './service/local.kanban-column.service';
import { LocalLabelService } from './service/local.label.service';
import { LocalProjectService } from './service/local.project.service';
import { LocalProjectStageService } from './service/local.stage.service';
import { LocalSubtaskService } from './service/local.subtask';
import { LocalTaskService } from './service/local.task.service';


export class LocalDataSource implements IDataSource{

  private projectService: IProjectService;
  private stageService: IProjectStageService;
  private taskService: ITaskService;
  private subtaskService: ISubtaskService;
  private labelService: ILabelService;
  private kanbanColumnService: IKanbanColumnService;


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

    this.kanbanColumnService = new LocalKanbanColumnService(kanbanColumnRepository);
    this.projectService = new LocalProjectService(projectRepository, stageRepository, this.kanbanColumnService);
    this.stageService = new LocalProjectStageService(stageRepository);
    this.labelService = new LocalLabelService(labelRepository, taskLabelsRepository);
    this.subtaskService = new LocalSubtaskService(subtaskRepository);
    this.taskService = new LocalTaskService(taskRepository, this.subtaskService, this.labelService);
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
    throw new Error('Method not implemented.');
  }

  public getKanbanColumnService(): IKanbanColumnService {
    return this.kanbanColumnService;
  }

  public getPomodoroService(): IPomodoroService {
    throw new Error('Method not implemented.');
  }

}
