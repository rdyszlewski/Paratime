import { Project } from 'app/models/project';

export class ProjectDetails{

    private project:Project = new Project();

    public getProject(){
        // TODO: odpowiednie ustawianie dat
        return this.project;
    }

    public setProject(project:Project){
        if(project){
            this.project = project;
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
}