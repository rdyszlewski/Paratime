import { ProjectDetails } from './model';
import { Project } from 'app/data/models/project';

export class ProjectChangeDetector{

    private model: ProjectDetails;
    private originProject: Project;

    constructor(model:ProjectDetails){
        this.model = model;
        this.originProject = this.copyProject(this.model.getProject());
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

    public isNameChanged():boolean{
        if(this.model.getProject() != null && this.originProject != null){
            return this.model.getProject().getName() != this.originProject.getName();
        }
        return false;
    }

    public isEndDateChanged():boolean{
        if(this.model.getProject() != null && this.originProject != null){
            return this.model.getProject().getEndDate() != this.originProject.getEndDate();
        }
        return false;
    }
}
