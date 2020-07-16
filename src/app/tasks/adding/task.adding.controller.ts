import { Task } from 'app/models/task';
import { TasksAddingModel } from './task.adding.model';
import { TasksModel } from '../model';
import { DataService } from 'app/data.service';
import { ScrollBarHelper, FocusHelper } from 'app/common/view_helper';
import { EditInputHandler } from 'app/common/edit_input_handler';

export class TaskAddingController{

    private TASK_LIST = "#tasks-list";
    private TASK_NAME_INPUT = "#new-task-name";

    private mainModel: TasksModel;
    private model: TasksAddingModel = new TasksAddingModel();

    constructor(mainModel: TasksModel){
        this.mainModel = mainModel;
    }

    public getModel(){
        return this.model;
    }

    public openAddingTask(){
        this.model.openAddingTask();
        FocusHelper.focus(this.TASK_NAME_INPUT);
        ScrollBarHelper.moveToBottom(this.TASK_LIST);
    }

    public addNewTask(){
        this.saveTask();
      }
    
    private saveTask(){
        const task = new Task();
        task.setName(this.model.getNewTaskName());
        task.setProject(this.mainModel.getProject());
        const lastElement = this.mainModel.getTasks()[this.mainModel.getTasks().length-1];
        if(lastElement){
            task.setOrderPrev(lastElement.getId());
        }
        // TODO: pobranie ostantiego elementu na liście i wstawienie 
        DataService.getStoreManager().getTaskStore().createTask(task).then(insertedTask=>{
            this.mainModel.addTask(insertedTask);
            this.closeAddingNewTask();
            ScrollBarHelper.moveToBottom(this.TASK_LIST);
        });
    }
    
    public closeAddingNewTask(){
        this.model.setNewTaskName("");
        this.model.closeAddingTask();
    }
    
    public handleAddingNewTaskKeyUp(event:KeyboardEvent){
        EditInputHandler.handleKeyEvent(event, 
            ()=>this.addNewTask(),
            ()=>this.closeAddingNewTask()
        );
       
    }

}