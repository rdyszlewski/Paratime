import Dexie from 'dexie';
import { Task } from 'app/database/shared/task/task';

import { LabelsTask } from 'app/database/shared/label/labels-task';
import { KanbanColumn } from '../shared/kanban-column/kanban-column';
import { KanbanTask } from '../shared/kanban-task/kanban-task';
import { Label } from '../shared/label/label';
import { PomodoroHistory } from '../shared/pomodoro/pomodoro.history';
import { Project } from '../shared/project/project';
import { Stage } from '../shared/stage/stage';
import { Subtask } from '../shared/subtask/subtask';

export class LocalDatabase extends Dexie {
  private dbVersion = 1;

  private tasksTable: Dexie.Table<Task, number>;
  private subtasksTable: Dexie.Table<Subtask, number>;
  private projectsTable: Dexie.Table<Project, number>;
  private labelsTable: Dexie.Table<Label, number>;
  private taskTagsTable: Dexie.Table<LabelsTask, number>;
  private stagesTable: Dexie.Table<Stage, number>;
  private pomodoroTable: Dexie.Table<PomodoroHistory, number>;
  private kanbanColumnsTable: Dexie.Table<KanbanColumn, number>;
  private kanbanTasksTable: Dexie.Table<KanbanTask, number>;

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
    this.projectsTable.mapToClass(Project);
    this.tasksTable.mapToClass(Task);
    this.subtasksTable.mapToClass(Subtask);
    this.labelsTable.mapToClass(Label);
    this.taskTagsTable.mapToClass(LabelsTask);
    this.stagesTable.mapToClass(Stage);
    this.pomodoroTable.mapToClass(PomodoroHistory);
    this.kanbanColumnsTable.mapToClass(KanbanColumn);
    this.kanbanTasksTable.mapToClass(KanbanTask);
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
