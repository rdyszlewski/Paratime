import { Label } from 'app/models/label';

export class TaskFilteringModel{

    private filterOpen = false;
    
    private labels: Label[] = [];

    public isFilterOpen():boolean{
        return this.filterOpen;
    }

    public toggleFilterOpen():void{
        this.filterOpen = !this.filterOpen;
    }

    public getLabels():Label[]{
        return this.labels;
    }

    public setLabels(labels:Label[]):void{
        this.labels = labels;
    }
}