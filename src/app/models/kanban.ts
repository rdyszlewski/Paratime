import { Task } from './task';
import { JsonpClientBackend } from '@angular/common/http';

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

    // TODO: można wydzielić zarządzanie listą do oddzielnej klasy
    public moveKanbanTasks(previousIndex: number, currentIndex:number):KanbanTask[]{
        // TODO: refaktoryzacja
        const toUpdate = [];
        const previousTask = this.kanbanTasks[previousIndex];
        const currentTask = this.kanbanTasks[currentIndex];
       
        const prevPrev = this.findKanbanTaskById(previousTask.getPrevTaskId());
        const prevNext = this.findKanbanTaskById(previousTask.getNextTaskId());
        const currPrev = this.findKanbanTaskById(currentTask.getPrevTaskId());
        const currNext = this.findKanbanTaskById(currentTask.getNextTaskId());
        if(prevPrev){
            prevPrev.setNextTaskId(currentTask.getId());
            toUpdate.push(prevPrev);
        }
        if(prevNext ){
            prevNext.setPrevTaskId(currentTask.getId());
            toUpdate.push(prevNext);
        }
        if(currPrev ){
            currPrev.setNextTaskId(previousTask.getId());
            toUpdate.push(currPrev);
        }
        if(currNext){
            currNext.setPrevTaskId(previousTask.getId());
            toUpdate.push(currNext);
        }
        
        const tempPrevious = previousTask.getPrevTaskId();
        const tempNext = previousTask.getNextTaskId();
        previousTask.setPrevTaskId(currentTask.getPrevTaskId());
        previousTask.setNextTaskId(currentTask.getNextTaskId());
        currentTask.setPrevTaskId(tempPrevious);
        currentTask.setNextTaskId(tempNext);

        toUpdate.push(previousTask);
        toUpdate.push(currentTask);

        return toUpdate;
    }


    public removeKanbanTask(kanbanTask: KanbanTask):KanbanTask[]{
        const toUpdate = [];
        const previousTask = this.findKanbanTaskById(kanbanTask.getPrevTaskId());
        const nextTask = this.findKanbanTaskById(kanbanTask.getNextTaskId());
        if(previousTask){
            previousTask.setNextTaskId(nextTask?nextTask.getId(): -1);
            toUpdate.push(previousTask);
        }
        if(nextTask){
            nextTask.setPrevTaskId(previousTask?previousTask.getId(): -1);
            toUpdate.push(nextTask);
        }

        return toUpdate;
    }

    public insertKanbanTask(kanbanTask: KanbanTask, position:number):KanbanTask[]{
        const toUpdate = [];
        this.changeKanbanColumn(kanbanTask);
        toUpdate.push(kanbanTask);
        if(this.isEmpty()){
            this.setKanbanTaskFirst(kanbanTask);
            return toUpdate;
        }
        const currentTask = this.kanbanTasks[position];
        if(currentTask){
            this.insertTaskBeforeTask(currentTask, kanbanTask, toUpdate);
        } else {
            this.insertTaskToEnd(kanbanTask);
        }
        return toUpdate;
    }

    private setKanbanTaskFirst(kanbanTask: KanbanTask) {
        kanbanTask.setPrevTaskId(-1);
    }

    private setKanbanTaskLast(kanbanTask: KanbanTask) {
        kanbanTask.setNextTaskId(-1);
    }

    private isEmpty() {
        return this.kanbanTasks.length == 0;
    }

    private changeKanbanColumn(kanbanTask: KanbanTask) {
        kanbanTask.setColumnId(this.id);
        this.setKanbanTaskFirst(kanbanTask);
        this.setKanbanTaskLast(kanbanTask);
    }

    private insertTaskToEnd(kanbanTask: KanbanTask) {
        const lastElement = this.kanbanTasks[this.kanbanTasks.length - 1];
        lastElement.setNextTaskId(kanbanTask.getId());
        kanbanTask.setPrevTaskId(lastElement.getId());
        kanbanTask.setNextTaskId(-1);
    }

    private insertTaskBeforeTask(currentTask: KanbanTask, kanbanTask: KanbanTask, toUpdate: any[]) {
        const previousTask = this.findKanbanTaskById(currentTask.getPrevTaskId());

        kanbanTask.setPrevTaskId(currentTask.getPrevTaskId());
        kanbanTask.setNextTaskId(currentTask.getId());
        currentTask.setPrevTaskId(kanbanTask.getId());

        toUpdate.push(currentTask);
        if (previousTask) {
            previousTask.setNextTaskId(kanbanTask.getId());
            toUpdate.push(previousTask);
        }
    }

    private findKanbanTaskById(id:number){
        return this.kanbanTasks.find(x=>x.getId()==id);
    }
}

export class KanbanTask{

    private id: number;
    private taskId:number;
    private columnId: number;
    private prevTaskId: number = -1;
    private nextTaskId: number = -1;
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
        this.nextTaskId = taskId;
    }

    public getTask(){
        return this.task;
    }

    public setTask(task: Task){
        this.task = task;
    }

}