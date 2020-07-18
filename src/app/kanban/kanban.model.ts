import { Task } from 'app/models/task';
import { KanbanColumn } from 'app/models/kanban';

export class KanbanModel{
    
    private columns: KanbanColumn[] = [];
    // private columns: Map<string, Task[]> = new Map();

    constructor(){

    }


    // private init(){
    //     this.columns.set("To Do", []);
    //     this.columns.set("In Progress", []);
    //     this.columns.set("Complete", []);
    //     this.columns.set("Backlog", []);

    //     const task1 = new Task("Pierwsze");
    //     const task2 = new Task("Drugie");
    //     this.columns.get("To Do").push(task1);
    //     this.columns.get("To Do").push(task2);
    // }

    // public getColumnsNames(){
    //     const names = [];
    //     this.columns.forEach((tasks, name)=>{
    //         names.push(name);
    //     });
    //     return names;
    // }

    // public getTasks(columnName:string):Task[]{
    //     return this.columns.get(columnName);
    // }

    public getColumns(): KanbanColumn[]{
        return this.columns;
    }

    public addColumn(kanbanColumn: KanbanColumn){
        // TODO: w tym miejscu zrobić sortowanie kolumn
        this.columns.push(kanbanColumn);
    }

    public getColumnsNames(){
        const names = [];
        this.columns.forEach(column=>{
            names.push(column.getName());
        });
        return names;
    }
}