import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { Tag } from 'app/models/tag';
import { Subtask } from 'app/models/subtask';

export class TaskDetails{
    private task: Task = new Task();
    private projects: Project[] = [];
    private selectedProject: Project;
    private tags: Tag[] = [];
    private updateMode:boolean;
    
    private subtaskEditing:boolean = false;
    private editedSubtask:Subtask;

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

    public getSelectedProject(){
        return this.selectedProject;
        // if(this.selectedProject){
        //     return this.selectedProject.getId();
        // }
        // return -1;
    }

    public setSelectedProject(project:Project){
        this.selectedProject = project;
    }

    public getTags():Tag[]{
        return this.tags;
    }

    public setTags(tags: Tag[]){
        this.tags = tags;
        this.repairTaskLabels(tags);
    }

    private repairTaskLabels(labels:Tag[]){
        let toRemove = [];
        this.getTask().getTags().forEach(label=>{
          const foundLabel = labels.find(x=>x.getId()==label.getId());
          if(foundLabel){
            label.setName(foundLabel.getName());
          } else {
            toRemove.push(label);
          }
        });
    
        toRemove.forEach(label=>{
          this.getTask().removeTag(label);
        });
      }

    public isSubtaskEditing(){
        return this.subtaskEditing;
    }

    public setSubtaskEditing(editing: boolean){
        this.subtaskEditing = editing;
    }

    public getEditedSubtask(){
        return this.editedSubtask;
    }

    public setEditedSubtask(subtask:Subtask){
        this.editedSubtask = subtask;
    }

   // form group extending
   public isDescriptionExtended(){
       return this.task.getDescription() != null;
   }

   public isStatusExtended(){
       return this.task.getStatus()!=null;
   }

   public isEndDateExtended(){
       return this.task.getEndDate() != null;
   }

   public isPlannedTimeExtended(){
       return this.task.getPlannedTime() != null;
   }

   public isProjectExtended(){
       return this.task.getProject() != null;
   }

   public isTagsExtended(){
       return this.task.getTags().length > 0;
   }

   public isSubtasksExtended(){
       return this.task.getSubtasks().length > 0;
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

   public isUpdateMode():boolean{
       return this.updateMode;
   }

   public setUpdateMode(updateMode:boolean){
       this.updateMode = updateMode;
   }
}