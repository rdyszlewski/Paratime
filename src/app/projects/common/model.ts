import { Project } from 'app/models/project';
import { TasksList } from 'app/common/lists/tasks.list';

export class ProjectsModel{

    // private projects: Project[] = [];
    private projects: TasksList<Project> = new TasksList();
    private selectedProject: Project = null;
    private projectWithOpenMenu: Project = null;

    public setProjects(projects:Project[]){
        this.projects.setItems(projects);
    }

    public getProjects(){
        return this.projects.getItems();
    }

    public getProjectByIndex(index: number): Project{
      return this.projects.getItemByIndex(index);
    }

    public addProject(project:Project){
        return this.projects.addItem(project);
    }

    public removeProject(project:Project){
        this.projects.removeItem(project);
    }

    public updateProjects(projects: Project[]){
      this.projects.updateItems(projects);
    }

    public filterProject(filter:string){
        this.projects.filter(filter);
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
      // TODO: sprawdzić, czy to będzie potrzebne
      this.projects.updateItems([project]);
    }

    public getProjectWithOpenMenu():Project{
        return this.projectWithOpenMenu;
    }

    public setProjectWithOpenMenu(project:Project){
        this.projectWithOpenMenu = project;
    }
}
