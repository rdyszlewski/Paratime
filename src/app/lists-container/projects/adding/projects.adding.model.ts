export class ProjectsAddingModel {

    private newProjectName: string;

    public getNewProjectName():string{
        return this.newProjectName;
    }

    public setNewProjectName(name:string){
        this.newProjectName = name;
    }
}