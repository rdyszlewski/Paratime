import { Task } from 'app/models/task';

export class KanbanModel{
    
    private columns: Map<string, Task[]> = new Map();

    constructor(){
        this.init();
    }


    private init(){
        this.columns.set("To Do", []);
        this.columns.set("In Progress", []);
        this.columns.set("Complete", []);
        this.columns.set("Backlog", []);

        const task1 = new Task("Pierwsze");
        const task2 = new Task("Drugie");
        this.columns.get("To Do").push(task1);
        this.columns.get("To Do").push(task2);
    }

    public getColumnsNames(){
        const names = [];
        this.columns.forEach((tasks, name)=>{
            names.push(name);
        });
        return names;
    }

    public getTasks(columnName:string):Task[]{
        return this.columns.get(columnName);
    }

}