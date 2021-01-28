import { Task } from 'app/database/shared/task/task';
import { TaskRepositoryFilter } from 'app/database/local/task/local.task.filter';
import { TaskFilter } from 'app/database/shared/task/task.filter';
import { DexieTaskDTO } from './local.task';
import { OrderRepository } from './order.respository';

export class LocalTaskRepository extends OrderRepository<DexieTaskDTO> {

  constructor(table: Dexie.Table<DexieTaskDTO, number>){
    super(table, "projectID");
  }

  public findById(id: number): Promise<DexieTaskDTO>{
    return this.table.get(id);
  }

  public findByName(name: string): Promise<DexieTaskDTO[]>{
    return this.table.where("name").startsWithIgnoreCase(name).toArray();
  }

  // TODO: można wstawić wyszukiwanie po nazwie, albo można dodać nazwę do filtrów

  public findByFilter(filter: TaskFilter): Promise<DexieTaskDTO[]>{
    // TODO: przerobić filtry, aby działały na obiektach Dexie
    let taskFilter = new TaskRepositoryFilter(filter);

    // TODO: sprawdzić z tym filrem
    return this.table.filter(task=>taskFilter.apply(task)).toArray()
  }

  public findByProject(projectId: number): Promise<DexieTaskDTO[]>{
    console.log("Pobierz wszystkie zadania z projektu");
    return this.table.where("projectID").equals(projectId).toArray();
  }

  public findAll():Promise<DexieTaskDTO[]>{
    return this.table.toArray();
  }

  // TODO: jakoś ogarnąć znajdź pierwsze i ostatnie zadanie z określonym statusem

  public insert(task: DexieTaskDTO): Promise<number>{
    // let preparedTask = this.getPreparedTask(task);
    return this.table.add(task);
  }

  // TODO: zastanowić się, czy tutaj powinno być Task czy DexieTaskDTO
  public remove(task: Task): Promise<void>{
    return this.table.delete(task.id);
  }

  public update(task:DexieTaskDTO):Promise<number>{
    // let preparedTask = this.getPreparedTask(task);
    return this.table.update(task.id, task);
  }
}
