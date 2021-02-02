import { Stage } from 'app/database/shared/stage/stage';
import { StageFilter } from 'app/database/shared/stage/stage.filter';
import { OrderRepository } from '../task/order.respository';
import { DexieStageDTO } from './local.stage';
import { StageRepositoryFilter } from './local.stage.filter';


export class LocalProjectStageRepository extends OrderRepository<DexieStageDTO>{

  constructor(table: Dexie.Table<DexieStageDTO, number>){
    super(table, "projectID");
  }

  public findById(id: number): Promise<DexieStageDTO>{
    return this.table.get(id);
  }

  public findByName(name: string): Promise<DexieStageDTO[]>{
    return this.table.where("name").startsWithIgnoreCase(name).toArray();
  }

  public findByFilter(filter: StageFilter): Promise<DexieStageDTO[]>{
    return this.table.toArray();
    let stageFilter = new StageRepositoryFilter(filter);
    return this.table.filter(stage=>stageFilter.apply(stage)).toArray();
  }

  public insert(stage: DexieStageDTO): Promise<number>{
    return this.table.add(stage);
  }

  public remove(id: number): Promise<void>{
    return this.table.delete(id);
  }

  public update(stage: DexieStageDTO): Promise<number>{
    return this.table.update(stage.id, stage);
  }
}
