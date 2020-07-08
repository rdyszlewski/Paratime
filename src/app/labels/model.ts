import { Tag } from 'app/models/tag';
import { FilteredList } from 'app/common/filter/filtered_list';

export class LabelsModel{

    private labels:Tag[] = [];
    private filteredList: FilteredList<Tag> = new FilteredList();
    private editedLabel: Tag;
    private labelEditing: boolean;


    public getLabels():Tag[]{
        return this.filteredList.getElements();
    }

    public setLabels(labels:Tag[]){
        this.labels = labels;
        this.updateFilterdList();
    }

    private updateFilterdList(){
        this.filteredList.setSource(this.labels);
    }

    public addLabel(label:Tag){
        this.labels.push(label);
        this.updateFilterdList();
    }

    public removeLabel(label:Tag){
        const index = this.labels.indexOf(label);
        if(index >= 0){
            this.labels.splice(index, 1);
        }
        this.updateFilterdList();
    }

    public getEditedLabel():Tag{
        return this.editedLabel;
    }

    public setEditedLabel(label:Tag){
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