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
    return this.table.filter(project=>projectFilter.apply(project)).toArray();
  }

  public findAll(): Promise<DexieProjectDTO[]>{
    return this.table.toArray();
  }

  public insert(project: Project): Promise<number>{
    return this.table.add(new DexieProjectDTO(project));
  }

  public remove(id: number): Promise<void>{
    return this.table.delete(id);
  }

  public update(project:DexieProjectDTO):Promise<number>{
    return this.table.update(project.id, project);
  }
}
