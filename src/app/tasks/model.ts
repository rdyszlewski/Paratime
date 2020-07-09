import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { FilteredList } from 'app/common/filter/filtered_list';

export class TasksModel{

    private project: Project = new Project();
    private filteredList: FilteredList<Task> = new FilteredList();
    private taskWithOpenMenu: Task;
    private addingTaskMode: boolean = false;
    private newTaskName: string = "";

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
        this.updateFilteredList();
    }

    private updateFilteredList(){
        this.filteredList.setSource(this.project.getTasks());
    }

    public getTasks():Task[]{
        return this.filteredList.getElements();
    }

    public addTask(task:Task){
        this.project.addTask(task);
        this.updateFilteredList();
    }

    public filterTasks(filter:string):void{
        this.filteredList.filter(filter);
    }

    public removeTask(task:Task){
        this.project.removeTask(task);
        this.updateFilteredList();
    }

    public getTaskWithOpenMenu():Task{
        return this.taskWithOpenMenu;
    }

    public setTaskWithOpenMenu(task:Task){
        this.taskWithOpenMenu = task;
    }

    public isAddingTaskMode():boolean{
        return this.addingTaskMode;
    }

    public setAddingTaskMode(addingTask:boolean){
        this.addingTaskMode = addingTask;
    }

    public getNewTaskName():string{
        return this.newTaskName;
    }

    public setNewTaskName(name:string){
        this.newTaskName = name;
    }
}