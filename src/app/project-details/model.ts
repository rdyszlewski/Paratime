import { Project } from 'app/models/project';
import { runInThisContext } from 'vm';

export class ProjectDetails{

    private project:Project = new Project();
    public updateMode: boolean;

    public getProject(){
        // TODO: odpowiednie ustawianie dat
        return this.project;
    }

    public setProject(project:Project){
        if(project){
            this.project = project;
            this.updateMode = project.getId()!=null;
        }
        
    }

    public getName():Project{
        if(this.project){
            return this.getName();
        }
        return null;
    }

    public getStartDate(){
        if(this.project){
            return this.getStartDate();
        }
        return null;
    }

    public isUpdateMode():boolean{
        return this.updateMode;
    }

    public setUpdateMode(updateMode:boolean){
        this.updateMode = updateMode;
    }
   

}