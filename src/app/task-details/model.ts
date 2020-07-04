import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { Tag } from 'app/models/tag';
import { Subtask } from 'app/models/subtask';
import { Status } from 'app/models/status';

export class TaskDetails{
    private task: Task = new Task();
    private projects: Project[] = [];
    private selectedProject: Project;
    private tags: Tag[] = [];
    
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
    }

    public isSubtaskEditing(){
        return this.subtaskEditing;
    }

    public toggleSubtaskEditing(){
        this.subtaskEditing = !this.subtaskEditing;
    }

    public getEditedSubtask(){
        return this.editedSubtask;
    }

    public setEditedSubtask(subtask:Subtask){
        this.editedSubtask = subtask;
    }

   
}