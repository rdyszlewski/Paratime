import { KanbanColumn, KanbanTask } from 'app/models/kanban';
import { Project } from 'app/models/project';
import { TasksList } from 'app/common/lists/tasks.list';

export class KanbanModel{
    private defaultColumn: KanbanColumn = new KanbanColumn();
    private columns: KanbanColumn[] = [];
    private tasks: Map<number, TasksList<KanbanTask>> = new Map();
    private project: Project;
    private columnName: string;

    private newTaskName: string;
    private columnAddingOpen: KanbanColumn;

    constructor(){

    }

    public getColumns(): KanbanColumn[]{
        return this.columns;
    }

    public getDefaultColumn(): KanbanColumn{
        return this.defaultColumn;
    }

    public getColumnName():string{
        return this.columnName;
    }

    public setColumnName(name:string){
        this.columnName = name;
    }

    public getProject():Project{
        return this.project;
    }

    public setProject(project: Project){
        this.project = project;
    }

    public getTasks(column: KanbanColumn){
      const tasks = this.tasks.get(column.getId());
      if(tasks){
        return tasks.getItems();
      }
      return [];
    }

    public updateTasks(tasks: KanbanTask[], columnId: number){
      this.tasks.get(columnId).updateItems(tasks);
    }

    public removeTasks(task: KanbanTask, columnId: number){
      this.tasks.get(columnId).removeItem(task);
    }

    public insertTask(task: KanbanTask, columnId: number){
      this.tasks.get(columnId).addItem(task);
    }

    public getTaskByIndex(index:number, columnId:number){
      return this.tasks.get(columnId).getItemByIndex(index);
    }

    public addColumn(kanbanColumn: KanbanColumn){
        if(kanbanColumn.isDefault()){
              this.defaultColumn = kanbanColumn;
          } else {
              this.columns.push(kanbanColumn);
        }
        this.tasks.set(kanbanColumn.getId(), new TasksList(kanbanColumn.getId()));
        this.tasks.get(kanbanColumn.getId()).setItems(kanbanColumn.getKanbanTasks());
    }

    public getColumnsNames():string[]{
      // TODO: może nazwy tabel do łączenia tabel nie są dobrym pomysłem
      const names = [];
      this.columns.forEach(column=>{
          if(column.getId()){
              names.push(column.getId().toString());
          }
      });
      //-X-DEFAULT-X-"
      // names.push("Nieprzypisane");
      if(this.getDefaultColumn().getId()){
          names.push(this.defaultColumn.getId().toString());
      }
      return names;
    }

    public getLastColumn():KanbanColumn{
        if(this.columns.length == 0){
            return this.defaultColumn;
        }
        return this.columns[this.columns.length-1];
    }

    public clearColumns(){
        this.columns = [];
        this.defaultColumn = new KanbanColumn();
    }

    public getColumnById(id:number){
        if(id == this.defaultColumn.getId()){
            return this.defaultColumn;
        }
        return this.columns.find(x=>x.getId()==id);
    }

    public getColumnIdText(column:KanbanColumn){
        if(column.getId()){
            return column.getId().toString();
        }
        return null;
    }

    public getNewTaskName():string{
        return this.newTaskName;
    }

    public setNewTaskName(name:string):void{
        this.newTaskName = name;
    }

    public getColumnAddingOpen():KanbanColumn{
        return this.columnAddingOpen;
    }

    public setColumnAddingOpen(column: KanbanColumn):void{
        this.columnAddingOpen = column;
    }
}
