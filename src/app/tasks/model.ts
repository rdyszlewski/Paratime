import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { FilteredList } from 'app/common/filter/filtered_list';
import { OrderedList } from 'app/common/order/ordered.list';
import { TasksMode } from 'app/services/app/app.service';
import { TaskType } from './tasks.component';

export class TasksModel{

    private project: Project = new Project();
    private filteredList: FilteredList<Task> = new FilteredList();
    private taskWithOpenMenu: Task;
    // TODO: przemysleć to
    private tasks: OrderedList<Task> = new OrderedList();
    private taskType: TaskType = TaskType.ACTIVE;


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
        this.project = project;
    }

    // TODO: może zmienić tę motodę
    private updateFilteredList(){
      this.filteredList.setSource(this.tasks.getItems());
    }

    public getTasks():Task[]{
        return this.filteredList.getElements();
    }

    public addTask(task:Task){
        this.project.addTask(task);
        this.tasks.addItem(task);
    }

    public updateTasks(tasks:Task[]){
      this.tasks.updateItems(tasks);
    }

    public refresh(){
      this.filteredList.refresh();
    }

    public filterTasks(filter:string):void{
        this.filteredList.filter(filter);
    }

    public removeTask(task:Task){

        this.project.removeTask(task);
        this.tasks.removeItem(task);
        // this.updateFilteredList();
        this.refresh();
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

    public getTaskByIndex(index: number): Task{
        const task = this.filteredList.getElements()[index];
        return task;
    }

    public setTaskType(taskType: TaskType){
      this.taskType = taskType;
    }

    public isActiveTaskType(){
      return this.taskType == TaskType.ACTIVE;
    }
}
