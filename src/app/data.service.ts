import { Injectable } from '@angular/core';
import { IDataSource } from './database/shared/data.source';
import { IKanbanColumnService } from './database/shared/kanban-column/kanban-column.service';
import { IKanbanTaskService } from './database/shared/kanban-task/kanban-task.service';
import { ILabelService } from './database/shared/label/label.service';
import { IPomodoroService } from './database/shared/pomodoro/pomodoro.service';
import { IProjectService } from './database/shared/project/project.service';
import { IProjectStageService } from './database/shared/stage/stage.service';
import { ISubtaskService } from './database/shared/subtask/subtask.service';
import { ITaskService } from './database/shared/task/task.service';

@Injectable({
  providedIn: 'root'
})
export class DataService implements IDataSource {

  private dataSource: IDataSource;

  constructor() {

  }

  public setSource(source: IDataSource){
    this.dataSource = source;
  }

  getProjectService(): IProjectService {
    return this.dataSource.getProjectService();
  }

  getTaskService(): ITaskService {
    return this.dataSource.getTaskService();
  }

  getSubtaskService(): ISubtaskService {
    return this.dataSource.getSubtaskService();
  }

  getLabelService(): ILabelService {
    return this.dataSource.getLabelService();
  }

  getStageService(): IProjectStageService {
    return this.dataSource.getStageService();
  }

  getKanbanTaskService(): IKanbanTaskService {
    return this.dataSource.getKanbanTaskService();
  }

  getKanbanColumnService(): IKanbanColumnService {
    return this.dataSource.getKanbanColumnService();
  }

  getPomodoroService(): IPomodoroService {
    return this.dataSource.getPomodoroService();
  }
}
