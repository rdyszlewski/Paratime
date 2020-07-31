import { KanbanColumn, KanbanTask } from 'app/models/kanban';
import { Project } from 'app/models/project';
import { TaskItemOrderer } from 'app/common/order/orderer';

export class KanbanModel{
    // TODO: do tej klasy powinniśmy jeszcze dodać

    private defaultColumn: KanbanColumn = new KanbanColumn();
    private columns: KanbanColumn[] = [];
    private project: Project;
    private columnName: string;

    private newTaskName: string;
    private columnAddingOpen: KanbanColumn;
    private taskOrderer: TaskItemOrderer<KanbanTask> = new TaskItemOrderer();
    // private columns: Map<string, Task[]> = new Map();

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

    public addColumn(kanbanColumn: KanbanColumn){
        // TODO: w tym miejscu zrobić sortowanie kolumn
        // TODO: sortowanie zadań, później gdzieś to przełożyć
        const sortedTasks = this.taskOrderer.getSortedItems(kanbanColumn.getKanbanTasks());
        kanbanColumn.setKanbanTasks(sortedTasks);
        if(kanbanColumn.isDefault()){
            this.defaultColumn = kanbanColumn;
        } else {
            this.columns.push(kanbanColumn);
        }
    }

    public getColumnsNames():string[]{
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
