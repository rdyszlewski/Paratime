import { Project } from 'app/models/project';

export class ProjectsModel{

    private projects: Project[] = [];
    private filteredProjects: Project[] = [];
    private selectedProject: Project = null;
    private lastFilter:string = "";

    public getProjects(){
        // return this.projects;
        return this.filteredProjects;
    }

    public addProject(project:Project){
        this.projects.push(project);
        this.filterProject(this.lastFilter);
    }

    public removeProject(project:Project){
        console.log(project);
        const index = this.projects.indexOf(project);
        console.log(index);
        if(index >=0){
            this.projects.splice(index, 1);
            this.filterProject(this.lastFilter);
        }
    }

    public filterProject(filter:string){
        this.filteredProjects = [];
        this.projects.filter(x=>x.getName().includes(filter)).forEach(project=>{
            this.filteredProjects.push(project);
        });
        this.lastFilter = filter;
    }

    public getSelectedProject():Project{
        return this.selectedProject;
    }

    public setSelectedProject(project:Project) {
        this.selectedProject = project;
    }

    public updateProject(project:Project){
        const projectToUpdate = this.projects.find(x=>x.getId()==project.getId());
        if(projectToUpdate){
            projectToUpdate.setName(project.getName());
        }
    }
}