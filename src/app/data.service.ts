import { Injectable } from '@angular/core';
import { IDataSource } from './database/common/data.source';
import { IKanbanColumnService } from './database/common/kanban-column.service';
import { IKanbanTaskService } from './database/common/kanban-task.service';
import { ILabelService } from './database/common/label.service';
import { IPomodoroService } from './database/common/pomodoro.service';
import { IProjectService } from './database/common/project.service';
import { IProjectStageService } from './database/common/stage.service';
import { ISubtaskService } from './database/common/subtask.service';
import { ITaskService } from './database/common/task.service';

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
