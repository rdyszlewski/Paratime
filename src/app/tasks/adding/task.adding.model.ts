export class TasksAddingModel{

    private addingOpen: boolean = false;
    private newTaskName: string = "";

    public isAddingOpen():boolean{
        return this.addingOpen;
    }

    public openAddingTask():void{
        this.addingOpen = true;
    }

    public closeAddingTask():void{
        this.addingOpen = false;
    }

    public getNewTaskName():string{
        return this.newTaskName;
    }

    public setNewTaskName(name:string): void{
        this.newTaskName = name;
    }
}