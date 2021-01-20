
import { KanbanColumn } from 'app/database/shared/kanban-column/kanban-column';
import { KanbanTask } from 'app/database/shared/kanban-task/kanban-task';
import { Project } from 'app/database/shared/project/project';
import { TasksList } from 'app/shared/common/lists/tasks.list';
import { FocusHelper } from 'app/shared/common/view_helper';

export class KanbanModel {
  // TODO: możliwe, że będzie trzeba zmienić listę, poniewa tutaj chyba nie będzie się sortowało
  private columns: TasksList<KanbanColumn> = new TasksList();
  private tasks: Map<number, TasksList<KanbanTask>> = new Map();
  private project: Project;
  private columnName: string;
  private newTaskName: string;
  private columnAddingOpen:boolean = false;
  private addingTaskOpen: KanbanColumn;
  private columnNameValid:boolean = true;
  private editedColumn: KanbanColumn;

  constructor() {}

  public getColumns(): KanbanColumn[] {
    return this.columns.getItems();
    // return this.columns.getItems().filter(x=>!x.isDefault());
  }

  public getDefaultColumn(): KanbanColumn {
    return this.columns.getItems().filter((x) => x.default)[0];
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
    columns.forEach((column) => {
      this.tasks.set(column.id, new TasksList(column.id));
      this.tasks.get(column.id).setItems(column.kanbanTasks);
    });
    // TODO: ten sposób możę być bardziej wymagający
  }

  public getColumnById(columnId: number): KanbanColumn {
    return this.columns.getItems().find((x) => x.id == columnId);
  }

  public getProject(): Project {
    return this.project;
  }

  public setProject(project: Project) {
    if (project) {
      this.columns.setContainerId(project.id);
    }
    this.project = project;
  }

  public updateColumns(columns: KanbanColumn[]) {
    this.columns.updateItems(columns);
  }

  public getTasks(column: KanbanColumn) {
    const tasks = this.tasks.get(column.id);
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
    this.tasks.get(task.columnId).addItem(task);
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
    // this.columns.addItem(kanbanColumn);

    this.tasks.set(kanbanColumn.id, new TasksList(kanbanColumn.id));
    this.tasks
      .get(kanbanColumn.id)
      .setItems(kanbanColumn.kanbanTasks);
  }

  public getColumnsNames(): string[] {
    const names = [];
    this.columns.getItems().forEach((item) => {
      if (item.id) {
        names.push(item.id.toString());
      }
    });
    return names;
  }

  public getColumnIdText(column: KanbanColumn) {
    if (column.id) {
      return column.id.toString();
    }
    return null;
  }

  public getNewTaskName(): string {
    return this.newTaskName;
  }

  public setNewTaskName(name: string): void {
    this.newTaskName = name;
  }

  public reset() {
    this.columns.clear();
    this.tasks.clear();
  }

  public isAddingOpen():boolean{
    return this.columnAddingOpen;
  }

  public openAddingColumn(){
    this.columnAddingOpen = true;
    FocusHelper.focus("#new-column-input");
  }

  public closeAdddingColumn(){
    this.setColumnName("");
    this.columnAddingOpen = false;
  }

  public getAddingTaskOpen():KanbanColumn{
    return this.addingTaskOpen;
  }

  public setAddingTaskOpen(column:KanbanColumn){
    this.addingTaskOpen = column;
  }

  public isColumnNameValid():boolean{
    return this.columnNameValid;
  }

  public setColumnNameValid(valid:boolean){
    this.columnNameValid = valid;
  }

  public getEditedColumn():KanbanColumn{
    return this.editedColumn;
  }

  public setEditedColumn(column:KanbanColumn){
    this.editedColumn = column;
  }
}
