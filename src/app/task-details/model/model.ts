import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { Stage } from 'app/models/stage';
import { Subtask } from 'app/models/subtask';

export class TaskDetails{
    private task: Task = new Task();
    private projects: Project[] = [];
   
    private stages: Stage[] = [];

    
    public getTask():Task{
        return this.task;
    }

    public setTask(task:Task){
        // TODO: w tym miejscu posortować podzadania
        this.task = task;
        this.task.setSubtasks(this.getSortedSubtasks(this.task.getSubtasks()));
    }

    private getSortedSubtasks(elements: Subtask[]):Subtask[]{
        const result = [];
        if(elements.length == 0){
            return result;
        }
        let currentTask = this.findFirstSubtask(elements);
        while(currentTask != null){
            currentTask = this.findSubtaskByPrevious(currentTask.getId(), elements);
        }
        return result;
    }

    private findFirstSubtask(elements: Subtask[]):Subtask{
        return elements.find(subtask=>subtask.getPreviousSubtask() == -1);
    }

    private findSubtaskByPrevious(prevId: number, elements:Subtask[]):Subtask{
        return elements.find(subtask=>subtask.getPreviousSubtask() == prevId);
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

   public getSubtaskByIndex(index:number){
    return this.task.getSubtasks()[index];
   }

   public getSubtaskByOrderPrev(subtask: Subtask):Subtask{
       return this.task.getSubtasks().find(x=>x.getPreviousSubtask()==subtask.getId());
   }
}