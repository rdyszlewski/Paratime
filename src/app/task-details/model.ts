import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { Label } from 'app/models/label';
import { Subtask } from 'app/models/subtask';
import { Stage } from 'app/models/stage';

export class TaskDetails{
    private task: Task = new Task();
    private projects: Project[] = [];
    private selectedProject: Project;
    private labels: Label[] = [];
    private stages: Stage[] = [];

    private originTask: Task;
    
    private subtaskEditing:boolean = false;
    private editedSubtask:Subtask;

    public getTask():Task{
        return this.task;
    }

    public setTask(task:Task){
        this.task = task;
        this.originTask = this.copyTask(task);
    }

    private copyTask(task:Task):Task{
        // TODO: można to dokończyć i przenieść do innej klasy
        const newTask = new Task();
        newTask.setName(task.getName());
        newTask.setDescription(task.getDescription());
        newTask.setStatus(task.getStatus());
        newTask.setEndDate(task.getEndDate());
        newTask.setPlannedTime(task.getPlannedTime());

        return newTask;
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

    public getStages():Stage[]{
        return this.stages;
    }

    public setStages(stages:Stage[]){
        this.stages = stages;
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

    public isStageExtended():boolean{
        return this.task.getProjectStageID() != null;
    }

   // form group extending
   public isDescriptionExtended(){
       return this.task.getDescription() != null;
   }

   public isStatusExtended(){
       return this.task.getStatus()!=null;
   }

   public isDateExtended(){
       return this.task.getDate() != null;
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

   public isNameValid(){
       return this.task.getName() != null && this.task.getName() != "";
   }

   public isNameChanged(){
       // TODO: sprawdzić, czy to będzie miało sens
       if(this.task != null && this.originTask != null){
           return this.task.getName() != this.originTask.getName();
       }
       return false;
   }

   public isValid():boolean{
       return this.isNameValid();
   }

   public toggleTaskImportance(){
       this.task.setImportant(!this.task.isImportant());
   }
}