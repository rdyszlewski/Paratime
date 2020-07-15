import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { Stage } from 'app/models/stage';

export class TaskDetails{
    private task: Task = new Task();
    private projects: Project[] = [];
   
    private stages: Stage[] = [];

    
    public getTask():Task{
        return this.task;
    }

    public setTask(task:Task){
        this.task = task;
    }

    public getProjects():Project[]{
        return this.projects;
    }

    public setProjects(projects: Project[]){
        this.projects = projects;
    }


    public getStages():Stage[]{
        return this.stages;
    }

    public setStages(stages:Stage[]){
        this.stages = stages;
    }

   public setProject(id:number){
        for(let i =0; i<this.projects.length; i++){
            const project = this.projects[i];
            if(project.getId()==id){
                return project;
            }
        }
        return null;
   }

   public toggleTaskImportance(){
       this.task.setImportant(!this.task.isImportant());
   }
}