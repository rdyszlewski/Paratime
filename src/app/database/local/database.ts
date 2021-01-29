import Dexie from 'dexie';

import { LabelsTask } from 'app/database/shared/label/labels-task';
import { Subtask } from '../shared/subtask/subtask';
import { DexieTaskDTO } from './task/local.task';
import { DexieProjectDTO } from './project/local.project';
import { DexieKanbanColumnDTO } from './kanban-column/local.kanban-column';
import { DexieStageDTO } from './stage/local.stage';
import { DexiePomodoroHistoryDTO } from './pomodoro/local.pomodoro';
import { DexieKanbanTaskDTO } from './kanban-task/local.kanban-task';
import { KanbanTaskDTO } from './kanban-task/local.kanban-task.repository';
import { DexieLabelDTO } from './label/local.label';

export class LocalDatabase extends Dexie {
  private dbVersion = 1;

  private tasksTable: Dexie.Table<DexieTaskDTO, number>;
  private subtasksTable: Dexie.Table<Subtask, number>;
  private projectsTable: Dexie.Table<DexieProjectDTO, number>;
  private labelsTable: Dexie.Table<DexieLabelDTO, number>;
  private taskTagsTable: Dexie.Table<LabelsTask, number>;
  private stagesTable: Dexie.Table<DexieStageDTO, number>;
  private pomodoroTable: Dexie.Table<DexiePomodoroHistoryDTO, number>;
  private kanbanColumnsTable: Dexie.Table<DexieKanbanColumnDTO, number>;
  private kanbanTasksTable: Dexie.Table<KanbanTaskDTO, number>;

  constructor() {
    super('Database');
    this.createTables();
  }

  private createTables() {
    this.createSchama();
    this.initTables();
    this.mapToClasses();
  }

  private createSchama() {
    this.version(this.dbVersion).stores({
      tasks:
        '++id, name, description, important, date, endDate, startTime, endTime, plannedTime, status, progress, projectID, priority, projectStageID, successor, position',
      subtasks: '++id, name, status, taskId, successor, position',
      projects:
        '++id, name, description, startDate, endDate, status, type, successor, position',
      labels: '++id, name, successor, position',
      task_labels: '[taskId+labelId], taskId, labelId',
      stages:
        '++id, name, description, startDate, endDate, status, projectID, successor, position',
      pomodoro: '++id, taskId, projectId, time, date',
      kanban_columns: '++id, projectId, name, default, successor, position',
      kanban_tasks: '++id, taskId, columnId, successor, position',
    });
  }

  private initTables() {
    this.tasksTable = this.table('tasks');
    this.subtasksTable = this.table('subtasks');
    this.projectsTable = this.table('projects');
    this.labelsTable = this.table('labels');
    this.taskTagsTable = this.table('task_labels');
    this.stagesTable = this.table('stages');
    this.pomodoroTable = this.table('pomodoro');
    this.kanbanColumnsTable = this.table('kanban_columns');
    this.kanbanTasksTable = this.table('kanban_tasks');
  }

  private mapToClasses() {
    this.projectsTable.mapToClass(DexieProjectDTO);
    this.tasksTable.mapToClass(DexieTaskDTO);
    this.subtasksTable.mapToClass(Subtask);
    this.labelsTable.mapToClass(DexieLabelDTO);
    this.taskTagsTable.mapToClass(LabelsTask);
    this.stagesTable.mapToClass(DexieStageDTO);
    this.pomodoroTable.mapToClass(DexiePomodoroHistoryDTO);
    this.kanbanColumnsTable.mapToClass(DexieKanbanColumnDTO);
    this.kanbanTasksTable.mapToClass(DexieKanbanTaskDTO);
  }

  public getTasksTable() {
    return this.tasksTable;
  }

  public getSubtasksTable() {
    return this.subtasksTable;
  }

  public getProjectsTable() {
    return this.projectsTable;
  }

  public getLabelsTable() {
    return this.labelsTable;
  }

  public getTaskLabelsTable() {
    return this.taskTagsTable;
  }

  public getStagesTable() {
    return this.stagesTable;
  }

  public getPomodoroTable() {
    return this.pomodoroTable;
  }

  public getKanbanColumnsTable() {
    return this.kanbanColumnsTable;
  }

  public getKanbanTasksTable() {
    return this.kanbanTasksTable;
  }
}
