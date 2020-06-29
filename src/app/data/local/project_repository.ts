import { IProjectRepository } from '../common/project_repository';
import { Project } from 'app/models/project';

export class LocalProjectRepository implements IProjectRepository{

    private table: Dexie.Table<Project, number>;

    constructor(table: Dexie.Table<Project, number>){
        this.table = table;;
    }

    public findProjectById(id: number): Promise<Project> {
        return this.table.where('id').equals(id).first();
    }

    public findProjectsByName(name: string): Promise<Project[]> {
        return this.table.where('name').equals(name).toArray();
    }

    public findProjectsByDescription(description: string): Promise<Project[]> {
        // TODO: przerobić to jakoś. Dexie nie udostepnia LIKE
        return this.table.where('description').startsWith(description).toArray();
    }

    public findProjectsByDeadlineDate(date: Date): Promise<Project[]> {
        return this.table.where('endDate').equals(date).toArray();
    }

    public insertProject(project: Project): Promise<Project> {
        let projectToSave = this.getProjectCopyReadyToSave(project);
        return this.table.add(projectToSave).then(insertedId=>{
            return this.table.get(insertedId);
        });
    }

    public updateProject(project: Project): Promise<Project> {
        let projectToUpdate = this.getProjectCopyReadyToSave(project);
        return this.table.update(project.getId(), projectToUpdate).then(result=>{
            return Promise.resolve(project);
        });
    }

    public removeProject(id: number): Promise<void> {
        return this.table.delete(id);
    }

    private getProjectCopyReadyToSave(project:Project): Project{
        let newProject = new Project(project.getName(), project.getDescription(), project.getStatus(), project.getType());
        if(project.getId()){
            newProject.setId(project.getId());
        }
        newProject.setEndDate(project.getEndDate());

        return newProject;
    }
}