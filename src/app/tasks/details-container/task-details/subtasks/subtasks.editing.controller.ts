import { SubtasksEditingModel } from './subtasks.editing.model';
import { Status } from 'app/database/data/models/status';
import { Subtask } from 'app/database/data/models/subtask';
import { Task } from 'app/database/data/models/task';
import { DataService } from 'app/data.service';
import { TaskDetails } from '../model/model';
import { FocusHelper, ScrollBarHelper } from 'app/shared/common/view_helper';
import { EditInputHandler } from 'app/shared/common/edit_input_handler';

export class SubtasksController{

    private SUBTASK_NAME_ID = '#subtask-input';
    private SUBTASK_ITEM_ID = '#subtask-name-input_';
    private LIST_DETAILS_FORM = "#list-details-form";

    private editingModel: SubtasksEditingModel = new SubtasksEditingModel();
    private task: Task;

    constructor(private model: TaskDetails, private dataService: DataService){
    }

    public getModel():SubtasksEditingModel{
        return this.editingModel;
    }

    public setTask(task:Task){
        this.task = task;
    }

    public openAddingSubtask(){
        this.editingModel.openAddingSubtask();
        FocusHelper.focus(this.SUBTASK_NAME_ID);
        ScrollBarHelper.moveToBottom(this.LIST_DETAILS_FORM);
    }

    public closeAddingSubtask(){
        this.editingModel.setNewSubtaskName("");
        this.editingModel.closeAddingSubtask();
    }

    public addNewSubtask(){
        // TODO: określenie pozycji
        const subtask = new Subtask(this.editingModel.getNewSubtaskName(), Status.STARTED);
        subtask.setTaskId(this.task.getId());
        this.saveNewSubtask(subtask);
        this.closeAddingSubtask();
        ScrollBarHelper.moveToBottom(this.LIST_DETAILS_FORM);
    }

    private saveNewSubtask(subtask: Subtask) {
        this.dataService.getSubtaskService().create(subtask).then(result=>{
          this.model.updateSubtasks(result.updatedElements);
        })
    }

    public openEditingSubtask(subtask:Subtask){
        this.editingModel.setEditingSubtaskName(subtask.getName());
        this.editingModel.openEditingSubtask(subtask);
        FocusHelper.focus(this.getSubtaskItemId(subtask));
    }

    public closeEditingSubtask(){
        this.editingModel.closeEditingSubtask();
    }

    private getSubtaskItemId(subtask: Subtask):string{
        return this.SUBTASK_ITEM_ID + subtask.getId();
    }

    public acceptEditingSubtask(subtask:Subtask){
        subtask.setName(this.editingModel.getEditingSubtaskName());
        this.updateSubtask(subtask);
    }

    private updateSubtask(subtask: Subtask) {
        this.dataService.getSubtaskService().update(subtask).then(updatedSubtask=>{
          this.closeEditingSubtask();
        });
    }

    public removeSubtask(subtask:Subtask){
        this.dataService.getSubtaskService().remove(subtask).then(updatedSubtasks=>{
          this.model.updateSubtasks(updatedSubtasks);
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
