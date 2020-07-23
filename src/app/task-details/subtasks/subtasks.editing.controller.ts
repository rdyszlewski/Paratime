import { FocusHelper, ScrollBarHelper } from 'app/common/view_helper';
import { SubtasksEditingModel } from './subtasks.editing.model';
import { Status } from 'app/models/status';
import { Subtask } from 'app/models/subtask';
import { Task } from 'app/models/task';
import { DataService } from 'app/data.service';
import { EditInputHandler } from 'app/common/edit_input_handler';

export class SubtasksController{
    
    private SUBTASK_NAME_ID = '#subtask-input';
    private SUBTASK_ITEM_ID = '#subtask-name-input_';
    private LIST_DETAILS_FORM = "#list-details-form";

    private model: SubtasksEditingModel = new SubtasksEditingModel();
    private task: Task;

    public getModel():SubtasksEditingModel{
        return this.model;
    }

    public setTask(task:Task){
        this.task = task;
    }

    public openAddingSubtask(){
        this.model.openAddingSubtask();
        FocusHelper.focus(this.SUBTASK_NAME_ID);
        ScrollBarHelper.moveToBottom(this.LIST_DETAILS_FORM);
    }

    public closeAddingSubtask(){
        this.model.setNewSubtaskName("");
        this.model.closeAddingSubtask();
    }
    
    public addNewSubtask(){
        // TODO: określenie pozycji
        const subtask = new Subtask(this.model.getNewSubtaskName(), Status.STARTED);
        subtask.setTaskId(this.task.getId());
        const lastSubtask = this.getLastSubtask();
        if(lastSubtask){
            subtask.setPreviousSubtask(lastSubtask.getId());
        }
        this.saveNewSubtask(subtask);
        this.closeAddingSubtask();
        ScrollBarHelper.moveToBottom(this.LIST_DETAILS_FORM);
    }

    private getLastSubtask(){
        // TODO: być może lepiej będzie zrobić to przez pobieranie z bazy
        return this.task.getSubtasks()[this.task.getSubtasks().length-1];
    }

    private saveNewSubtask(subtask: Subtask) {
        DataService.getStoreManager().getSubtaskStore().createSubtask(subtask).then(insertedSubtask => {
            this.task.addSubtask(insertedSubtask);
        });
    }

    public openEditingSubtask(subtask:Subtask){
        this.model.setEditingSubtaskName(subtask.getName());
        this.model.openEditingSubtask(subtask);
        FocusHelper.focus(this.getSubtaskItemId(subtask));
    }

    public closeEditingSubtask(){
        this.model.closeEditingSubtask();
    }

    private getSubtaskItemId(subtask: Subtask):string{
        return this.SUBTASK_ITEM_ID + subtask.getId();
    }

    public acceptEditingSubtask(subtask:Subtask){
        subtask.setName(this.model.getEditingSubtaskName());
        this.updateSubtask(subtask);
    }

    private updateSubtask(subtask: Subtask) {
        DataService.getStoreManager().getSubtaskStore().updateSubtask(subtask).then(updatedSubtask => {
            this.closeEditingSubtask();
        });
    }

    public removeSubtask(subtask:Subtask){
        DataService.getStoreManager().getSubtaskStore().removeSubtask(subtask.getId()).then(()=>{
            this.task.removeSubtask(subtask);
        });
    }

    public toggleSubtaskStatus(subtask:Subtask){
        switch(subtask.getStatus()){
            case Status.STARTED:
            subtask.setStatus(Status.ENDED);
            break;
            case Status.ENDED:
            subtask.setStatus(Status.STARTED);
            break;
        }
    }  

    public handleKeysOnNewSubtaskInput(event:KeyboardEvent){
        EditInputHandler.handleKeyEvent(event, 
            ()=>this.addNewSubtask(),
            ()=>this.closeAddingSubtask()
        );
    }

      public handleKeysOnEditSubtask(event:KeyboardEvent, subtask:Subtask){
        EditInputHandler.handleKeyEvent(event, 
            ()=>this.acceptEditingSubtask(subtask),
            ()=>this.closeEditingSubtask()
        );
    }
}