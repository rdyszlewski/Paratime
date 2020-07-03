import { Project } from 'app/models/project';

export class ProjectDetails{

    private project:Project;
    public startDate:Date;

    public getProject(){
        // TODO: odpowiednie ustawianie dat
        return this.project;
    }

    public setProject(project:Project){
        this.project = project;
        this.startDate = project.getStartDate();
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

   

}