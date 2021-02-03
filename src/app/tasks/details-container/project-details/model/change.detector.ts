import { Project } from 'app/database/shared/project/project';
import { ProjectDetails } from './model';

export class ProjectChangeDetector{

    private model: ProjectDetails;
    private originProject: Project;

    constructor(model:ProjectDetails){
        this.model = model;
        this.originProject = this.copyProject(this.model.getProject());
    }

    private copyProject(project:Project):Project{
        const newProject = new Project();
        newProject.name = project.name;;
        newProject.description = project.description;
        newProject.startDate = project.startDate;
        newProject.endDate = project.endDate;
        newProject.status = project.status;
        newProject.type = project.type;

        return newProject;
    }

    public isNameChanged():boolean{
        if(this.model.getProject() != null && this.originProject != null){
            return this.model.getProject().name != this.originProject.name;
        }
        return false;
    }

    public isEndDateChanged():boolean{
        if(this.model.getProject() != null && this.originProject != null){
            return this.model.getProject().endDate != this.originProject.endDate;
        }
        return false;
    }
}
