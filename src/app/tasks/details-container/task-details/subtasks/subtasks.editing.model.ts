import { Subtask } from 'app/data/models/subtask';

export class SubtasksEditingModel{

    private addingSubtask: boolean = false;
    private editedSubtask: Subtask;
    private newSubtaskName: string;
    private editingSubtaskName: string;

    public isAddingSubtask(){
        return this.addingSubtask;
    }

    public openAddingSubtask(){
        this.addingSubtask = true;
        this.closeEditingSubtask();
    }

    public closeAddingSubtask(){
        this.addingSubtask = false;
    }

    public isEditingSubtask(subtask:Subtask){
        return this.editedSubtask && this.editedSubtask.getId() == subtask.getId();
    }

    public getEditedSubtask(){
        return this.editedSubtask;
    }

    public openEditingSubtask(subtask: Subtask){
        this.editedSubtask = subtask;
        this.closeAddingSubtask();
    }

    public closeEditingSubtask(){
        this.editedSubtask = null;
    }

    public getNewSubtaskName():string{
        return this.newSubtaskName;
    }

    public setNewSubtaskName(name:string):void{
        this.newSubtaskName = name;
    }

    public getEditingSubtaskName(){
        return this.editingSubtaskName;
    }

    public setEditingSubtaskName(name:string):void{
        this.editingSubtaskName = name;
    }
}
