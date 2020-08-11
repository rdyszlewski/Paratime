import { Task } from './task';
import { OrderableItem } from './orderable.item';
import { IFilterable } from 'app/common/filter/filterable';

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

export class KanbanTask extends OrderableItem implements IFilterable{

    private taskId:number;
    private columnId: number;
    private task: Task;

    public getTaskId():number{
        return this.taskId;
    }

    public setTaskId(taskId: number){
        this.taskId = taskId;
    }

    public getName():string{
      if(this.task){
        return this.task.getName();
      }
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
        if(task){
          this.taskId = task.getId();
        }
    }

    public getContainerId():number{
      return this.getColumnId();
    }

    public setContainerId(id: number):void{
      this.setColumnId(id);
    }
}
