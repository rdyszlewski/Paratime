import { Project } from 'app/database/shared/project/project';
import { ProjectFilter } from 'app/database/shared/project/project.filter';
import { OrderRepository } from '../task/order.respository';
import { DexieProjectDTO } from './local.project';
import { ProjectRepositoryFilter } from './local.project.filter';

export class LocalProjectRepository extends OrderRepository<DexieProjectDTO> {

  constructor(table: Dexie.Table<DexieProjectDTO, number>){
    super(table, null);
  }

  public findById(id: number): Promise<DexieProjectDTO>{
    return this.table.get(id);
  }

  public findByName(name: string): Promise<DexieProjectDTO[]>{
    return this.table.where("name").equals(name).toArray();
  }

  public findByFilter(filter: ProjectFilter): Promise<DexieProjectDTO[]>{
    let projectFilter = new ProjectRepositoryFilter(filter);
    // TODO: sprawdzić, czy to działa poprawnie
    return this.table.filter(project=>projectFilter.apply(project)).toArray();
  }

  public findAll(): Promise<DexieProjectDTO[]>{
    return this.table.toArray();
  }

  public insert(project: Project): Promise<number>{
    // let preparedProject = this.getPreparedProject(project);
    return this.table.add(new DexieProjectDTO(project));
  }

  // TODO: zastanowić się, czy tutaj powinien być Project czy DexieProjectDTO
  public remove(project: Project): Promise<void>{
    return this.table.delete(project.id);
  }

  public update(project:DexieProjectDTO):Promise<number>{
    // let preparedProject = this.getPreparedProject(project);
    return this.table.update(project.id, project);
  }
}
