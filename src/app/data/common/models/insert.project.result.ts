import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { KanbanColumn } from 'app/models/kanban';

export class InsertProjectResult{

  private _insertedProject: Project;
  private _updatedProjects: Project[];

  private _insertedKanbanColumn: KanbanColumn;

  private _updatedKanbanColumns: KanbanColumn[];

  public get insertedProject():Project{
    return this._insertedProject;
  }

  public set insertedProject(project: Project){
    this._insertedProject = project;
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
