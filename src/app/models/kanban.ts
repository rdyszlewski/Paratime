import { Task } from './task';

export class KanbanColumn{
    
    private id:number;
    private projectId: number;
    private name:string;
    private default: number = 0;
    private prevColumnId: number = null;
    private nextColumnId: number = null;
    private kanbanTasks: KanbanTask[];

    public getId():number{
        return this.id;
    }

    public setId(id:number){
        this.id = id;
    }

    public getProjectId():number{
        return this.projectId;
    }

    public setProjectId(projectId: number){
        this.projectId = projectId;
    }

    public getName():string{
        return this.name;
    }

    public setName(name:string){
        this.name = name;
    }

    public isDefault():boolean{
        return this.default == 1;
    }

    public setDefault(def:boolean){
        this.default = def ? 1: 0;
    }

    public getPrevColumnId(){
        return this.prevColumnId;
    }

    public setPrevColumnId(columnId:number){
        this.prevColumnId = columnId;
    }

    public getNextColumnId(){
        return this.nextColumnId;
    }

    public setNextColumnId(columnId:number){
        this.nextColumnId = columnId;
    }

    public getKanbanTasks():KanbanTask[]{
        return this.kanbanTasks;
    }

    public setKanbanTasks(kanbanTasks: KanbanTask[]){
        this.kanbanTasks = kanbanTasks;
    }
}

export class KanbanTask{

    private id: number;
    private taskId:number;
    private columnId: number;
    private prevTaskId: number = null;
    private nextTaskId: number = null;
    private task: Task;

    public getId():number{
        return this.id;
    }

    public setId(id:number){
        this.id = id;
    }

    public getTaskId():number{
        return this.taskId;
    }

    public setTaskId(taskId: number){
        this.taskId = taskId;
    }

    public getColumnId():number{
        return this.columnId;
    }

    public setColumnId(columnId: number){
        this.columnId = columnId;
    }

    public getPrevTaskId():number{
        return this.prevTaskId;
    }

    public setPrevTaskId(taskId: number){
        this.prevTaskId = taskId;
    }

    public getNextTaskId():number{
        return this.nextTaskId;
    }

    public setNextTaskId(taskId:number){
        this.taskId = taskId;
    }

    public getTask(){
        return this.task;
    }

    public setTask(task: Task){
        this.task = task;
    }

}