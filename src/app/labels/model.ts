import { Label } from 'app/models/label';
import { FilteredList } from 'app/common/filter/filtered_list';

export class LabelsModel{

    private labels:Label[] = [];
    private filteredList: FilteredList<Label> = new FilteredList();
    private editedLabel: Label;
    private labelEditing: boolean;


    public getLabels():Label[]{
        return this.filteredList.getElements();
    }

    public setLabels(labels:Label[]){
        this.labels = labels;
        this.updateFilterdList();
    }

    private updateFilterdList(){
        this.filteredList.setSource(this.labels);
    }

    public addLabel(label:Label){
        this.labels.push(label);
        this.updateFilterdList();
    }

    public removeLabel(label:Label){
        const index = this.labels.indexOf(label);
        if(index >= 0){
            this.labels.splice(index, 1);
        }
        this.updateFilterdList();
    }

    public getEditedLabel():Label{
        return this.editedLabel;
    }

    public setEditedLabel(label:Label){
        this.editedLabel = label;
    }

    public isLabelEditing():boolean{
        return this.labelEditing;
    }

    public setLabelEditing(editing: boolean){
        return this.labelEditing = editing;
    }

    public filterLabels(filter:string){
        this.filteredList.filter(filter);
    }
}