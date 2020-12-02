import { Project } from 'app/database/data/models/project';
import { ProjectRepositoryFilter } from 'app/database/filter/local.project.filter';
import { ProjectFilter } from 'app/database/filter/project.filter';
import { OrderRepository } from './order.respository';

export class LocalProjectRepository extends OrderRepository<Project>{

  constructor(table: Dexie.Table<Project, number>){
    super(table, null);
  }

  public findById(id: number): Promise<Project>{
    return this.table.get(id);
  }

  public findByName(name: string): Promise<Project[]>{
    return this.table.where("name").equals(name).toArray();
  }

  public findByFilter(filter: ProjectFilter): Promise<Project[]>{
    let projectFilter = new ProjectRepositoryFilter(filter);
    return this.table.filter(project=>projectFilter.apply(project)).toArray();
  }

  public findAll(): Promise<Project[]>{
    return this.table.toArray();
  }

  public insert(project: Project): Promise<number>{
    let preparedProject = this.getPreparedProject(project);
    return this.table.add(preparedProject);
  }

  public remove(id: number): Promise<void>{
    return this.table.delete(id);
  }

  public update(project:Project):Promise<number>{
    let preparedProject = this.getPreparedProject(project);
    return this.table.update(project.getId(), preparedProject);
  }

  // TODO: sprawdzić, czy z następnikami i tak dalej wszystko będzie działać poprawnie

  private getPreparedProject(project: Project): Project{
    // TODO: pomyśleć, jak to można obejść
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
}
