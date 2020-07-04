import { Tag } from 'app/models/tag';

export class LabelsModel{

    private labels:Tag[] = [];
    private filteredLabels: Tag[] = [];
    private editedLabel: Tag;
    private labelEditing: boolean;
    private lastFilter: string = "";

    public getLabels():Tag[]{
        // return this.labels;
        return this.filteredLabels;
    }

    public setLabels(labels:Tag[]){
        this.labels = labels;
        this.filteredLabels = labels;
    }

    public addLabel(label:Tag){
        this.labels.push(label);
        this.filterLabels(this.lastFilter);
    }

    public removeLabel(label:Tag){
        const index = this.labels.indexOf(label);
        console.log(index);
        if(index >= 0){
            this.labels.splice(index, 1);
        }
        this.filterLabels(this.lastFilter);
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
        this.filteredLabels = this.labels.filter(x=>x.getName().includes(filter));
        this.lastFilter = filter;
    }
}