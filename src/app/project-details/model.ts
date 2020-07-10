import { Project } from 'app/models/project';

export class ProjectDetails{

    private project:Project = new Project();
    private originProject:Project;

    public getProject(){
        // TODO: odpowiednie ustawianie dat
        return this.project;
    }

    public setProject(project:Project){
        if(project){
            this.project = project;
            this.originProject = this.copyProject(project);
        }
    }

    private copyProject(project:Project):Project{
        const newProject = new Project();
        newProject.setName(project.getName());
        newProject.setDescription(project.getDescription());
        newProject.setEndDate(project.getEndDate());
        newProject.setStatus(project.getStatus());
        newProject.setType(project.getType());
        newProject.setStartDate(project.getStartDate());

        return newProject;
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

    public isNameValid():boolean{
        return this.project.getName() != null && this.project.getName()!= "";
    }

    public isEndDateValid():boolean{
        if(this.project.getStartDate() != null && this.project.getEndDate() != null){
            return this.project.getEndDate() >= this.project.getStartDate(); 
        }
        return true;
    }

    public isNameChanged(){
        if(this.project != null && this.originProject != null){
            return this.project.getName() != this.originProject.getName();
        }
        return false;
    }

    public isEndDateChanged(){
        if(this.project != null && this.originProject != null){
            return this.project.getEndDate() != this.originProject.getEndDate();
        }
        return false;
    }

    public isValid():boolean{
        return this.isNameValid();
    }
}