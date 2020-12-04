import { Subtask } from './subtask';
import { Status } from './status';
import { Project } from './project';
import { Label } from './label';
import { Priority } from './priority';
import { Stage } from './stage';
import { OrderableItem } from './orderable.item';
import { ITaskItem } from './task.item';
import { IFilterable } from 'app/shared/common/filter/filterable';
import { DateAdapter } from './date.adapter';

export class Task extends OrderableItem implements IFilterable, ITaskItem{

    // TODO: przejrzeć wszystkie zmienne i zobaczyć, czy wszystko jest ok

    private name: string = null;
    private description: string = null;
    private important: number = 0;
    private labels: Label[] = [];
    private date: string = null;
    private _date: Date = null;
    // tasks start time (format HHMM) H * 100 + M
    private startTime: number = null;
    private endTime: number = null;
    private endDate: string = null;
    private _endDate: Date = null;
    private plannedTime: number = null;
    private subtasks: Subtask[] = []
    private status: Status = Status.STARTED;
    private progress: number = null;
    private project: Project = null;
    private projectID;
    private priority: Priority = null;
    private projectStage: Stage = null;
    private projectStageID: number = null;

    constructor(name=null, description=null, status=null){
      super();
      this.name = name;
      this.description = description;
      this.status = status;
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
        return this.important? 1: 0;
    }

    public setImportant(important:boolean){
        this.important = important ? 1 : 0;
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
      return this._date;
    }

    public setDate(date:Date):void{
      this._date = date;
      this.date = DateAdapter.getText(date);
    }

    public getStartTime():number{
        return this.startTime;
    }

    public setStartTime(time:number):void{
        this.startTime = time;
    }

    public getEndTimer():number{
      return this.endTime;
    }

    public setEndTime(time: number){
      this.endTime = time;
    }

    public getEndDate():Date{
      return this._endDate;
    }

    public setEndDate(date: Date){
      this._endDate = date;
      this.endDate = DateAdapter.getText(date);
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

    public getContainerId():number{
      return this.getProjectID();
    }

    public setContainerId(id:number):void{
      // TODO: sprawdzić, czy ustawianie tylko id czegoś nie popsuje
      this.setProjectID(id);
    }
}
