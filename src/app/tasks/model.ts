import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { FilteredList } from 'app/common/filter/filtered_list';
import { OrderedList } from 'app/common/order/ordered.list';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';

export class TasksModel{

    private project: Project = new Project();
    private filteredList: FilteredList<Task> = new FilteredList();
    private taskWithOpenMenu: Task;
    // TODO: przemysleć to
    private tasks: OrderedList<Task> = new OrderedList();

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
        this.tasks.setItems(tasks);
        this.updateFilteredList();
    }

    public setProject(project:Project){
        // TODO: dopracować zarządzanie
        this.project = project;
        if(project){
          console.log("Zadania");
          console.log(project.getTasks());
          this.tasks.setItems(project.getTasks());
          this.updateFilteredList();
            // this.setTasks(project.getTasks());
        }
    }

    // TODO: może zmienić tę motodę
    private updateFilteredList(){
      console.log(this.tasks.getItems());
        this.filteredList.setSource(this.tasks.getItems());
    }

    public getTasks():Task[]{
        return this.filteredList.getElements();
    }

    public addTask(task:Task){
        this.project.addTask(task);
        this.tasks.addItem(task);
        console.log("Zaraz będę filtrował");
        this.updateFilteredList();
    }

    public filterTasks(filter:string):void{
        this.filteredList.filter(filter);
    }

    public removeTask(task:Task){
        this.project.removeTask(task);
        this.tasks.removeItem(task);
        this.updateFilteredList();
    }

    public getTaskWithOpenMenu():Task{
        return this.taskWithOpenMenu;
    }

    public setTaskWithOpenMenu(task:Task){
        this.taskWithOpenMenu = task;
    }

    public isOpen():boolean{
        return this.project != null;
    }

    public close(){
        this.open = false;
    }

    public getTaskByIndex(index: number): Task{
        const task = this.filteredList.getElements()[index];
        return task;
    }


}
