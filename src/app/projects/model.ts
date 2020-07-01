import { Project } from 'app/models/project';

export class ProjectsModel{

    private projects: Project[] = [];
    private filteredProjects: Project[] = [];
    private selectedProject: Project = null;

    public getProjects(){
        // return this.projects;
        return this.filteredProjects;
    }

    public addProject(project:Project){
        this.projects.push(project);
        this.filteredProjects.push(project);
    }

    public filterProject(filter:string){
        this.filteredProjects = [];
        this.projects.filter(x=>x.getName().includes(filter)).forEach(project=>{
            this.filteredProjects.push(project);
        });
    }

    public getSelectedProject():Project{
        return this.selectedProject;
    }

    public setSelectedProject(project:Project) {
        this.selectedProject = project;
    }
    
    // TODO: dodać usuwanie projektu
}