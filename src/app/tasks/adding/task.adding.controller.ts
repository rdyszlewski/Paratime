import { Task } from 'app/models/task';
import { TasksAddingModel } from './task.adding.model';
import { TasksModel } from '../model';
import { DataService } from 'app/data.service';
import { ScrollBarHelper, FocusHelper } from 'app/common/view_helper';
import { EditInputHandler } from 'app/common/edit_input_handler';
import { KanbanTask, KanbanColumn } from 'app/models/kanban';

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
        const lastElement = this.findLastTask();
        if(lastElement){
            task.setOrderPrev(lastElement.getId());
        }
        DataService.getStoreManager().getTaskStore().createTask(task).then(insertedTask=>{
            // TODO: to można przenieść w inne miejsce 
            this.insertKanbanTask(insertedTask);

            this.mainModel.addTask(insertedTask);
            this.closeAddingNewTask();
            ScrollBarHelper.moveToBottom(this.TASK_LIST);
        });
    }

    private findLastTask() {
        return this.mainModel.getTasks()[this.mainModel.getTasks().length - 1];
    }

    private insertKanbanTask(task: Task){
        // TODO: to powinno być w pakiecie z bazą danych
        // TODO: można to przenieść do jakiegoś serwisu, który będzie wstawiał to w odpowiednie miejsce
        DataService.getStoreManager().getKanbanStore().getDefaultColumn(task.getProject().getId()).then(defaultColumn=>{
            // insert to default column
            DataService.getStoreManager().getKanbanStore().getLastKanbanTask(defaultColumn.getId()).then(lastKanbanTask=>{
                const kanbanTask = this.createKanbanTask(defaultColumn, task, lastKanbanTask);
                DataService.getStoreManager().getKanbanStore().createKanbanTask(kanbanTask).then(createdTask=>{
                    if(lastKanbanTask){
                        this.updatePreviousKanbanTask(lastKanbanTask, createdTask);
                    }
                });
            })
            
        });
    }
    
    private updatePreviousKanbanTask(lastKanbanTask: KanbanTask, createdTask: KanbanTask) {
        lastKanbanTask.setNextTaskId(createdTask.getId());
        DataService.getStoreManager().getKanbanStore().updateKanbanTask(lastKanbanTask);
    }

    private createKanbanTask(defaultColumn: KanbanColumn, task: Task, lastKanbanTask: KanbanTask) {
        const kanbanTask = new KanbanTask();
        kanbanTask.setColumnId(defaultColumn.getId());
        kanbanTask.setTaskId(task.getId());
        if (lastKanbanTask) {
            kanbanTask.setPrevTaskId(lastKanbanTask.getId());
        }
        return kanbanTask;
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