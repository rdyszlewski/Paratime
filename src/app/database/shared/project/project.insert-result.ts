import { KanbanColumn } from '../kanban-column/kanban-column';
import { Project } from './project';

export class ProjectInsertResult{

  private _insertedProject: Project;
  private _updatedProjects: Project[];
  private _insertedKanbanColumn: KanbanColumn;
  private _updatedKanbanColumns: KanbanColumn[];

  constructor(insertedProject: Project){
    this._insertedProject = insertedProject;
  }

  public get insertedProject():Project{
    return this._insertedProject;
  }

  public get updatedProjects(): Project[] {
    return this._updatedProjects;
  }
  public set updatedProjects(value: Project[]) {
    this._updatedProjects = value;
  }

  public get insertedKanbanColumn(): KanbanColumn {
    return this._insertedKanbanColumn;
  }
  public set insertedKanbanColumn(value: KanbanColumn) {
    this._insertedKanbanColumn = value;
  }

  public get updatedKanbanColumns(): KanbanColumn[] {
    return this._updatedKanbanColumns;
  }
  public set updatedKanbanColumns(value: KanbanColumn[]) {
    this._updatedKanbanColumns = value;
  }
}
