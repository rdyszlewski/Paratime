import { Project } from 'app/database/shared/project/project';
import { ProjectFilter } from 'app/database/shared/project/project.filter';
import { OrderDTORepository } from '../task/order.repository.dto';
import { IOrderableRepository, OrderRepository } from '../task/order.respository';
import { DexieProjectDTO } from './local.project';
import { ProjectRepositoryFilter } from './local.project.filter';

export class LocalProjectRepository extends OrderDTORepository<Project, DexieProjectDTO> implements IOrderableRepository<Project> {

  constructor(table: Dexie.Table<DexieProjectDTO, number>){
    super(table, null);
  }

  public findById(id: number): Promise<Project>{
    return this.table.get(id).then(task=>{
      return Promise.resolve(task.getModel());
    });
  }

  public findByName(name: string): Promise<Project[]>{
    let result = this.table.where("name").equals(name).toArray();
    return this.mapToProject(result);
  }

  private mapToProject(dtoPromise: Promise<DexieProjectDTO[]>): Promise<Project[]>{
    return dtoPromise.then(tasks=>{
      let mappedTasks = tasks.map(x=>x.getModel());
      return Promise.resolve(mappedTasks);
    })
  }

  public findByFilter(filter: ProjectFilter): Promise<Project[]>{
    let projectFilter = new ProjectRepositoryFilter(filter);
    // TODO: sprawdzić, czy to działa poprawnie
    let result = this.table.filter(project=>projectFilter.apply(project.getModel())).toArray();
    return this.mapToProject(result);
  }

  public findAll(): Promise<Project[]>{
    return this.mapToProject(this.table.toArray());
  }

  public insert(project: Project): Promise<number>{
    // let preparedProject = this.getPreparedProject(project);
    return this.table.add(new DexieProjectDTO(project));
  }

  public remove(project: Project): Promise<void>{
    return this.table.delete(project.id);
  }

  public update(project:Project):Promise<number>{
    let preparedProject = this.getPreparedProject(project);
    return this.table.update(project.id, preparedProject);
  }

  // TODO: sprawdzić, czy z następnikami i tak dalej wszystko będzie działać poprawnie

  private getPreparedProject(project: Project): Project{
    // TODO: pomyśleć, jak to można obejść
    let newProject = new Project(project.name, project.description, project.status, project.type);
    if(project.id){
      newProject.id = project.id;
    }
    newProject.startDate = project.startDate;
    newProject.endDate = project.endDate;
    newProject.successorId = project.successorId;
    newProject.position = project.position;

    return newProject;
  }
}
