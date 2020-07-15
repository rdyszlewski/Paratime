export class LabelAddingModel{
    
    private newLabelName: string;

    public getNewLabelName():string{
        return this.newLabelName;
    }

    public setNewLabelName(name:string){
        this.newLabelName = name;
    }
}