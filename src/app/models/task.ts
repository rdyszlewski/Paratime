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
    private progress: number = -1;
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
        this.tags.push(tag);
    }

    private removeTag(tag: Tag){
        let index = this.getTagIndex(tag);
        if(index > 0){
            delete this.tags[index];
        }
    }

    private getTagIndex(tag:Tag){
        for(let i = 0; i< this.tags.length; i++){
            if(this.tags[i] === tag){
                return i;
            }
        }
        return -1;
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

    public addSubtask(subtask: Subtask){
        this.subtasks.push(subtask);
    }

    public removeSubtask(subtask: Subtask){
        let index = this.getSubtaskIndex(subtask.getId());
        if (index > 0){
            delete this.subtasks;
        }
    }

    private getSubtaskIndex(id: number){
        for(let i = 0; i < this.subtasks.length; i++){
            if(this.subtasks[i].getId() == id){
                return id;
            }
        }
        return -1;
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