import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { Label } from 'app/models/label';
import { Subtask } from 'app/models/subtask';

export class TaskDetails{
    private task: Task = new Task();
    private projects: Project[] = [];
    private selectedProject: Project;
    private labels: Label[] = [];
    
    private subtaskEditing:boolean = false;
    private editedSubtask:Subtask;

    public getTask():Task{
        return this.task;
    }

    public setTask(task:Task){
        console.log("Ustawianie zadania");
        console.log(task);
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

    public getLabels():Label[]{
        return this.labels;
    }

    public setLabels(labels: Label[]){
        this.labels = labels;
        this.repairTaskLabels(labels);
    }

    private repairTaskLabels(labels:Label[]){
        let toRemove = [];
        this.getTask().getLabels().forEach(label=>{
          const foundLabel = labels.find(x=>x.getId()==label.getId());
          if(foundLabel){
            label.setName(foundLabel.getName());
          } else {
            toRemove.push(label);
          }
        });
    
        toRemove.forEach(label=>{
          this.getTask().removeLabel(label);
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

   public isLabelsExtended(){
       return this.task.getLabels().length > 0;
   }

   public isSubtasksExtended(){
       return this.task.getSubtasks().length > 0;
   }

   public isPriorityExtended(){
       return this.task.getPriority() != null;
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
}