import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { FilteredList } from 'app/common/filter/filtered_list';
import { Label } from 'app/models/label';
import { TaskFilterModel } from './filter_model';

export class TasksModel{

    private project: Project = new Project();
    private filteredList: FilteredList<Task> = new FilteredList();
    private taskWithOpenMenu: Task;
    private addingTaskMode: boolean = false;
    private newTaskName: string = "";

    private filterOpen = false;
    private filter: TaskFilterModel = new TaskFilterModel();
    private labels: Label[] = [];
    private tasks: Task[] = [];
    private open;

    public getProject(){
        return this.project;
    }

    public getProjectName(){
        if(this.project){
            return this.project.getName();
        }
    }

    public setTasks(tasks:Task[]){
        this.tasks = tasks;
        this.updateFilteredList();
    }

    public setProject(project:Project){
        // TODO: dopracować zarządzanie
        this.project = project;
        if(project){
            this.open = true;
            this.tasks = this.project.getTasks();
        } else {
            this.open = false;
        }
        this.updateFilteredList();
    }

    private updateFilteredList(){
        this.filteredList.setSource(this.tasks);
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

    public isFilterOpen():boolean{
        return this.filterOpen;
    }

    public toggleFilterOpen():void{
        this.filterOpen = !this.filterOpen;
    }

    public getLabels():Label[]{
        return this.labels;
    }

    public setLabels(labels:Label[]):void{
        this.labels = labels;
    }

    public getFilter():TaskFilterModel{
        return this.filter;
    }

    public isOpen():boolean{
        return this.open;
    }

    public close(){
        this.open = false;
    }
}