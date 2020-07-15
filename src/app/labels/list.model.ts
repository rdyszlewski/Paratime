import { Label } from 'app/models/label';
import { FilteredList } from 'app/common/filter/filtered_list';

export class LabelsModel{

    private labels:Label[] = [];
    private filteredList: FilteredList<Label> = new FilteredList();

    public getLabels():Label[]{
        return this.filteredList.getElements();
    }

    public setLabels(labels:Label[]){
        this.labels = labels;
        this.updateFilterdList();
    }

    private updateFilterdList(){
        console.log(this.labels);
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

    public filterLabels(filter:string){
        this.filteredList.filter(filter);
    }
}
