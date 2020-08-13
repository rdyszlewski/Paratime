import { KanbanColumn, KanbanTask } from 'app/models/kanban';
import { Project } from 'app/models/project';
import { TasksList } from 'app/common/lists/tasks.list';

export class KanbanModel {
  // TODO: możliwe, że będzie trzeba zmienić listę, poniewa tutaj chyba nie będzie się sortowało
  private columns: TasksList<KanbanColumn> = new TasksList();
  private tasks: Map<number, TasksList<KanbanTask>> = new Map();
  private project: Project;
  private columnName: string;

  private newTaskName: string;
  private columnAddingOpen: KanbanColumn;

  constructor() {}

  public getColumns(): KanbanColumn[] {
    return this.columns.getItems();
    // return this.columns.getItems().filter(x=>!x.isDefault());
  }

  public getDefaultColumn(): KanbanColumn {
    return this.columns.getItems().filter((x) => x.isDefault())[0];
  }

  public getColumnName(): string {
    return this.columnName;
  }

  public getColumnByIndex(index: number): KanbanColumn {
    return this.getColumns()[index];
  }

  public setColumnName(name: string) {
    this.columnName = name;
  }

  public setColumns(columns: KanbanColumn[]) {
    console.log(columns);
    this.columns.setItems(columns);
    // TODO: ten sposób możę być bardziej wymagający
  }

  public getColumnById(columnId: number): KanbanColumn {
    return this.columns.getItems().find((x) => x.getId() == columnId);
  }

  public getProject(): Project {
    return this.project;
  }

  public setProject(project: Project) {
    if (project) {
      this.columns.setContainerId(project.getId());
    }
    this.project = project;
  }

  public updateColumns(columns: KanbanColumn[]) {
    this.columns.updateItems(columns);
  }

  public getTasks(column: KanbanColumn) {
    const tasks = this.tasks.get(column.getId());
    if (tasks) {
      return tasks.getItems();
    }
    return [];
  }

  public updateTasks(tasks: KanbanTask[], columnId: number) {
    const column = this.tasks.get(columnId);
    column.updateItems(tasks);
  }

  public addTask(task:KanbanTask):void{
    this.tasks.get(task.getColumnId()).addItem(task);
  }

  public removeTask(task: KanbanTask, columnId: number) {
    this.tasks.get(columnId).removeItem(task);
  }

  public insertTask(task: KanbanTask, columnId: number) {
    this.tasks.get(columnId).addItem(task);
  }

  public getTaskByIndex(index: number, columnId: number) {
    const column = this.tasks.get(columnId);
    return column.getItemByIndex(index);
  }

  public addColumn(kanbanColumn: KanbanColumn) {
    this.columns.addItem(kanbanColumn);

    this.tasks.set(kanbanColumn.getId(), new TasksList(kanbanColumn.getId()));
    this.tasks
      .get(kanbanColumn.getId())
      .setItems(kanbanColumn.getKanbanTasks());
  }

  public setTasks(kanbanColumns: KanbanColumn[]) {
    kanbanColumns.forEach((column) => {
      this.tasks.set(column.getId(), new TasksList(column.getId()));
      this.tasks.get(column.getId()).setItems(column.getKanbanTasks());
    });
  }

  public getColumnsNames(): string[] {
    const names = [];
    this.columns.getItems().forEach((item) => {
      if (item.getId()) {
        names.push(item.getId().toString());
      }
    });
    //-X-DEFAULT-X-"
    // names.push("Nieprzypisane");
    // if (this.getDefaultColumn().getId()) {
    //   names.push(this.defaultColumn.getId().toString());
    // }
    return names;
  }

  public getColumnIdText(column: KanbanColumn) {
    if (column.getId()) {
      return column.getId().toString();
    }
    return null;
  }

  public getNewTaskName(): string {
    return this.newTaskName;
  }

  public setNewTaskName(name: string): void {
    this.newTaskName = name;
  }

  public getColumnAddingOpen(): KanbanColumn {
    return this.columnAddingOpen;
  }

  public setColumnAddingOpen(column: KanbanColumn): void {
    this.columnAddingOpen = column;
  }

  public reset() {
    this.columns.clear();
    this.tasks.clear();
  }
}
