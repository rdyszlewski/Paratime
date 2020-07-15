import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { FilteredList } from 'app/common/filter/filtered_list';

export class TasksModel{

    private project: Project = new Project();
    private filteredList: FilteredList<Task> = new FilteredList();
    private taskWithOpenMenu: Task;
    
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
        // this.tasks = tasks;
        // TODO: sprawdzić, czy to będzie dobrze działać
        this.project.setTasks(tasks);
        this.updateFilteredList();
    }

    public setProject(project:Project){
        // TODO: dopracować zarządzanie
        this.project = project;
        if(project){
            this.open = true;
            // TODO: sprawdzać, czy to niczego nie zepsuje
            // this.tasks = this.project.getTasks();
        } else {
            this.open = false;
        }
        this.updateFilteredList();
    }

    private updateFilteredList(){
        // TODO: przemyśleć, ajk to poprawnie powinno wyglądać
        // this.filteredList.setSource(this.tasks);
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
    
    public isOpen():boolean{
        return this.open;
    }

    public close(){
        this.open = false;
    }
}