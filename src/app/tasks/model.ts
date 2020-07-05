import { Task } from 'app/models/task';
import { Project } from 'app/models/project';

export class TasksModel{

    private project: Project = new Project();
    private filteredTasks: Task[] = [];
    private lastFilter:string = "";
    private taskWithOpenMenu: Task;

    public getProject(){
        return this.project;
    }

    public getProjectName(){
        if(this.project){
            return this.project.getName();
        }
    }

    public setProject(project:Project){
        this.project = project;
        this.filteredTasks = project.getTasks();
    }

    public getTasks():Task[]{
        return this.filteredTasks;
    }

    public addTask(task:Task){
        this.project.addTask(task);
        this.filterTasks(this.lastFilter);
    }

    public filterTasks(filter:string):void{
        // TODO: być może będzie można filtrować po inych wartościach
        this.filteredTasks = this.project.getTasks().filter(x=>x.getName().includes(filter));
        this.lastFilter = filter;
    }

    public removeTask(task:Task){
        this.project.removeTask(task);
        this.filterTasks(this.lastFilter);
    }

    public getTaskWithOpenMenu():Task{
        return this.taskWithOpenMenu;
    }

    public setTaskWithOpenMenu(task:Task){
        this.taskWithOpenMenu = task;
    }
}