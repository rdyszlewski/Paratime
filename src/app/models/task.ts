import { Subtask } from './subtask';
import { Status } from './status';
import { Project } from './project';
import { Label } from './label';
import { IFilterable } from 'app/common/filter/i_filterable';
import { Priority } from './priority';
import { Stage } from './stage';
import { NumberInput } from '@angular/cdk/coercion';

export class Task implements IFilterable{

    // TODO: przejrzeć wszystkie zmienne i zobaczyć, czy wszystko jest ok

    private id: number;
    private name: string = null;
    private description: string = null;
    private important: number = 0;
    private labels: Label[] = [];
    private date:Date = null;
    private endDate: Date = null;
    private plannedTime: number = null;
    private subtasks: Subtask[] = []
    private status: Status = null;
    private progress: number = null;
    private project: Project = null;
    private projectID;
    private priority: Priority = null;
    private projectStage: Stage = null;
    private projectStageID: number = null;

    private orderPrev: number = null;

    constructor(name=null, description=null, status=null){
        this.name = name;
        this.description = description;
        this.status = status;
    }

    public getId(){
        return this.id;
    }

    public setId(id:number){
        this.id = id;
    }

    public getName(){
        return this.name;
    }


    public setName(name:string){
        this.name = name;
    }

    public getDescription(){
        return this.description;
    }

    public setDescription(description: string){
        this.description = description;
    }

    public isImportant():boolean{
        return this.important == 1;
    }

    public getImportant():number{
        console.log("Get important");
        return this.important? 1: 0;
    }

    public setImportant(important:boolean){
        this.important = important ? 1 : 0;
        // this.important = important;
    }

    public getLabels(){
        return this.labels;
    }

    public addLabel(label:Label){
        if(!this.labels.includes(label)){
            this.labels.push(label);
        }
    }

    public setLabels(labels:Label[]){
        this.labels = labels;
    }

    public removeLabel(label: Label){
        const index = this.labels.indexOf(label);
        if(index >= 0){
            this.labels.splice(index, 1);
        }
    }

    public getDate():Date{
        return this.date;
    }

    public setDate(date:Date):void{
        this.date = date;
    }

    public getEndDate():Date{
        return this.endDate;
    }

    public setEndDate(date: Date){
        this.endDate = date;
    }

    public getPlannedTime(){
        return this.plannedTime;
    }

    public setPlannedTime(time: number){
        this.plannedTime = time;
    }

    public getSubtasks(){
        return this.subtasks;
    }

    public setSubtasks(subtasks: Subtask[]){
        this.subtasks = subtasks;
    }

    public addSubtask(subtask: Subtask){
        this.subtasks.push(subtask);
    }

    public removeSubtask(subtask: Subtask){
        const index = this.subtasks.indexOf(subtask);
        if (index >= 0){
            this.subtasks.splice(index, 1);
        }
    }

    public getStatus(){
        return this.status;
    }

    public setStatus(status: Status){
        this.status = status;
    }

    public getProgress(){
        return this.progress;
    }

    public setProgress(progress: number){
        this.progress = progress;
    }
    
    public getProject(){
        return this.project;
    }

    public setProject(project: Project){
        this.project = project;
        this.projectID = project.getId();
    }

    public getProjectID(){
        return this.projectID;
    }

    public setProjectID(id: number){
        this.projectID = id;
    }

    public getNumberOfSubtaskWithStatus(status:Status){
        let finishedSubtask = this.getSubtasks().filter(x=>x.getStatus()==status);
        return finishedSubtask.length;
    }

    public getPriority():Priority{
        return this.priority;
    }

    public setPriority(priority:Priority){
        this.priority = priority;
    }
    
    public getProjectStage():Stage{
        return this.projectStage;
    }

    public setProjectStage(projectStage: Stage){
        this.projectStage = projectStage;
        if(this.projectStage){
            this.projectStageID = this.projectStage.getId();
        }
    }

    public getProjectStageID():number{
        return this.projectStageID;
    }

    public setProjectStageID(id:number){
        this.projectStageID = id;
    }
    
    public getOrderPrev():number{
        return this.orderPrev;
    }

    public setOrderPrev(prevId: number):void{
        this.orderPrev = prevId;
    }
}