import { Label } from 'app/data/models/label';

export class LabelViewState{

    private addingNewLabel: boolean;
    private editedLabel: Label;

    public openAddingLabel(){
        this.addingNewLabel = true;
        this.closeEditingLabel();
    }

    public closeAddingLabel(){
        this.addingNewLabel = false;
    }

    public isAddingLabel(){
        return this.addingNewLabel;
    }

    public openEditingLabel(label:Label){
        this.editedLabel = label;
        this.closeAddingLabel();
    }

    public closeEditingLabel(){
        this.editedLabel = null;
    }

    public isEditingLabel(label:Label){
        return this.editedLabel && this.editedLabel.getId() == label.getId();
    }
}
