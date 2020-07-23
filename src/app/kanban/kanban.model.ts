import { KanbanColumn, KanbanTask } from 'app/models/kanban';
import { Project } from 'app/models/project';

export class KanbanModel{
    
    private defaultColumn: KanbanColumn = new KanbanColumn();
    private columns: KanbanColumn[] = [];
    private project: Project;
    private columnName: string;
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
        kanbanColumn.setKanbanTasks(this.getSortedKanabanTasks(kanbanColumn.getKanbanTasks()));
        if(kanbanColumn.isDefault()){
            this.defaultColumn = kanbanColumn;
        } else {
            this.columns.push(kanbanColumn);
        }
    }

    private getSortedKanabanTasks(elements: KanbanTask[]){
        const result = [];
        if(elements.length == 0){
            return result;
        }

        let currentTask = this.findFirstKanbanTask(elements);
        console.log(currentTask);
        while(currentTask != null){
            result.push(currentTask);
            currentTask = this.findKanbanTaskByPrev(currentTask.getId(), elements);
            console.log(currentTask);
        }
        return result;
    }

    private findFirstKanbanTask(elements: KanbanTask[]){
        return elements.find(x=>x.getPrevTaskId()==-1);
    }

    private findKanbanTaskByPrev(prevId:number, elements: KanbanTask[]){
        return elements.find(x=>x.getPrevTaskId()==prevId);
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
}