export class ProjectStageModel{

    private addingStageOpen: boolean = false;
    private newStageName: string = "";

    public isAddingStageOpen(){
        return this.addingStageOpen;
    }

    public openAddingStage(){
        this.addingStageOpen = true;
    }

    public closeAddingStage(){
        this.addingStageOpen = false;
    }

    public getNewStageName():string{
        return this.newStageName;
    }

    public setNewStageName(name:string):void{
        this.newStageName = name;
    }
}