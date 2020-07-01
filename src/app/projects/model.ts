import { Project } from 'app/models/project';

export class ProjectsModel{

    private projects: Project[] = [];

    public getProjects(){
        return this.projects;
    }

    public addProject(project:Project){
        this.projects.push(project);
    }

    
    // TODO: dodać usuwanie projektu
}