import { Task } from './task';
import { JsonpClientBackend } from '@angular/common/http';
import { IOrderable } from 'app/common/order/order';
import { OrderValues } from 'app/common/valuse';

export class KanbanColumn{
    
    // TODO: przetestować, czy nie będzie to sprawiało problemów
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
        if(this.name){
            return this.name;
        }
        // TODO: przenieść to albo jakoś zmienić
        return "Nieprzypisane";
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

export class KanbanTask implements IOrderable{

    private id: number;
    private taskId:number;
    private columnId: number;
    private task: Task;

    private prevId: number = -1;
    private nextId: number = -1;

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

    public getTask(){
        return this.task;
    }

    public setTask(task: Task){
        this.task = task;
    }


    public getPrevId():number{
        return this.prevId;
    }

    public getNextId(): number {
        return this.nextId;
    }

    public setPrevId(id: number): void {
        this.prevId = id;
    }

    public setNextId(id: number): void {
        this.nextId = id;
    }

}