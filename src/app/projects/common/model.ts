import { Project } from 'app/models/project';
import { FilteredList } from 'app/common/filter/filtered_list';

export class ProjectsModel{

    private projects: Project[] = [];
    private filteredList: FilteredList<Project> = new FilteredList();
    private selectedProject: Project = null;
    private projectWithOpenMenu: Project = null;

    public setProjects(projects:Project[]){
        this.projects = projects;
        this.filteredList.setSource(this.projects);
    }

    public getProjects(){
        return this.filteredList.getElements();
    }

    public addProject(project:Project){
        this.projects.push(project);
        this.updateFilteredList();
    }

    public removeProject(project:Project){
        const index = this.projects.indexOf(project);
        if(index >=0){
            this.projects.splice(index, 1);
            this.updateFilteredList();
        }
    }

    private updateFilteredList(){
        this.filteredList.setSource(this.projects);
    }

    public filterProject(filter:string){
        this.filteredList.filter(filter);
    }

    public getSelectedProject():Project{
        return this.selectedProject;
    }

    public isSelectedProject(project:Project):boolean{
        if(this.getSelectedProject()==null){
          return false;
        }
        return project.getId() == this.getSelectedProject().getId();
    }

    public isSelectedProjectId(id: number) {
        return this.getSelectedProject() != null && id == this.getSelectedProject().getId();
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

    public getProjectWithOpenMenu():Project{
        return this.projectWithOpenMenu;
    }

    public setProjectWithOpenMenu(project:Project){
        this.projectWithOpenMenu = project;
    }
}