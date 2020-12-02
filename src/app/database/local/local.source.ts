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
import { LocalProjectRepository } from './repository/local.project.repository';
import { LocalProjectStageRepository } from './repository/local.stage.repository';
import { LocalTaskRepository } from './repository/local.task.repository';
import { LocalProjectService } from './service/local.project.service';
import { LocalProjectStageService } from './service/local.stage.service';


export class LocalDataSource implements IDataSource{

  private projectService: IProjectService;
  private stageService: IProjectStageService;
  private taskService: ITaskService;

  constructor(){
    // TODO: zrobić tak, żeby przekazywać bazę danych, aby mozna było wstawiać testową bazę
    let database = new LocalDatabase();

    let projectRepository = new LocalProjectRepository(database.getProjectsTable());
    let stageRepository = new LocalProjectStageRepository(database.getStagesTable());
    let taskRepository = new LocalTaskRepository(database.getTasksTable());

    this.projectService = new LocalProjectService(projectRepository, stageRepository);
    this.stageService = new LocalProjectStageService(stageRepository);
    // TODO: dokończyć to
  }

  getProjectService(): IProjectService {
    return this.projectService;
  }

  getTaskService(): ITaskService {
    throw new Error('Method not implemented.');
  }

  getSubtaskService(): ISubtaskService {
    throw new Error('Method not implemented.');
  }

  getLabelService(): ILabelService {
    throw new Error('Method not implemented.');
  }

  getStageService(): IProjectStageService {
    return this.stageService;
  }

  getKanbanTaskService(): IKanbanTaskService {
    throw new Error('Method not implemented.');
  }

  getKanbanColumnService(): IKanbanColumnService {
    throw new Error('Method not implemented.');
  }

  getPomodoroService(): IPomodoroService {
    throw new Error('Method not implemented.');
  }

}
