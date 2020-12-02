import { Project } from 'app/database/data/models/project';
import { LocalOrderRepository } from 'app/database/data/common/repositories/orderable.repository';
import { IProjectRepository } from 'app/database/data/common/repositories/project_repository';

export class LocalProjectRepository implements IProjectRepository{

    private table: Dexie.Table<Project, number>;
    private orderRepository: LocalOrderRepository<Project>;

    constructor(table: Dexie.Table<Project, number>){
        this.table = table;;
        this.orderRepository = new LocalOrderRepository(table, null);
    }

    public findAllProjects(): Promise<Project[]> {
        return this.table.toArray();
    }

    public findById(id: number): Promise<Project> {
        // return this.table.where('id').equals(id).first();
        return this.table.get(id);
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

    public insertProject(project: Project): Promise<number> {
        let projectToSave = this.getProjectCopyReadyToSave(project);
        return this.table.add(projectToSave);
    }

    public update(project: Project): Promise<number> {
        let projectToUpdate = this.getProjectCopyReadyToSave(project);
        return this.table.update(project.getId(), projectToUpdate);
    }

    public removeProject(id: number): Promise<void> {
        return this.table.delete(id);
    }

    private getProjectCopyReadyToSave(project:Project): Project{
        let newProject = new Project(project.getName(), project.getDescription(), project.getStatus(), project.getType());
        if(project.getId()){
            newProject.setId(project.getId());
        }
        newProject.setStartDate(project.getStartDate());
        newProject.setEndDate(project.getEndDate());
        newProject.setSuccessorId(project.getSuccessorId());
        newProject.setPosition(project.getPosition());

        return newProject;
    }

    public findBySuccessor(successorId: number): Promise<Project> {
      return this.orderRepository.findBySuccessor(successorId);
    }

    public findFirst(containerId: number): Promise<Project> {
      return this.orderRepository.findFirst(null);
    }

    public findLast(containerId: number, exceptItem: number): Promise<Project> {
      // TODO: tutaj może powinien być inny interfejs
      return this.orderRepository.findLast(null, exceptItem);
    }
}
