import { Subtask } from './subtask';
import { Status } from './status';
import { Project } from './project';
import { Tag } from './tag';

export class Task{

    // TODO: przejrzeć wszystkie zmienne i zobaczyć, czy wszystko jest ok

    private id: number;
    private name: string = null;
    private description: string = null;
    private tags: Tag[] = [];
    private endDate: Date = null;
    private plannedTime: number = null;
    private subtasks: Subtask[] = []
    private status: Status = null;
    private progress: number = null;
    private project: Project = null;
    private projectID = null;

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

    public getTags(){
        return this.tags;
    }

    public addTag(tag:Tag){
        if(!this.tags.includes(tag)){
            this.tags.push(tag);
        }
    }

    public removeTag(tag: Tag){
        const index = this.tags.indexOf(tag);
        if(index >= 0){
            this.tags.splice(index, 1);
        }
    }

    public getEndDate(){
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
        console.log("index " + index);
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
        // TODO: usunąć to
        this.projectID = project.getId();
    }

    public getProjectID(){
        return this.projectID;

        // if(this.project){
            
        //     return this.project.getId();
        // }
        // return null;
    }

    public setProjectID(id: number){
        this.projectID = id;
    }


}