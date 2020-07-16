import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { FilteredList } from 'app/common/filter/filtered_list';

export class TasksModel{

    private project: Project = new Project();
    private filteredList: FilteredList<Task> = new FilteredList();
    private taskWithOpenMenu: Task;
    // TODO: przemysleć to
    private tasks: Task[] = []
    
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
        const tasks = this.getSortedTasks(this.tasks);
        this.filteredList.setSource(tasks);
        
    }

    private getSortedTasks(elements: Task[]):Task[]{
        const result = [];
        if(elements.length == 0){
            return result;
        }
        let currentTask = this.findFirtstTask(elements);
        while(currentTask != null){
            result.push(currentTask);
            currentTask = this.findTaskByOrderPrev(currentTask.getId(), elements);
        }
        return result;
    }

    private findFirtstTask(elements:Task[]){
        return elements.find(task=>task.getOrderPrev() == null);
    }

    private findTaskByOrderPrev(prevId: number, elements:Task[]):Task{
        return elements.find(task=>task.getOrderPrev() == prevId);
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

    public getTaskByIndex(index: number): Task{
        const task = this.filteredList.getElements()[index];
        return task;
    }

    public getTaskByOrderPrev(prevId: number): Task{
        return this.project.getTasks().find(task=>task.getOrderPrev() == prevId);
        
    }
}