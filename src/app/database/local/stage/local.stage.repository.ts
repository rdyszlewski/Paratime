import { Stage } from 'app/database/shared/stage/stage';
import { StageFilter } from 'app/database/shared/stage/stage.filter';
import { OrderRepository } from '../task/order.respository';
import { StageRepositoryFilter } from './local.stage.filter';


export class LocalProjectStageRepository extends OrderRepository<Stage>{

  constructor(table: Dexie.Table<Stage, number>){
    super(table, "projectID");
  }

  public findById(id: number): Promise<Stage>{
    return this.table.get(id);
  }

  public findByName(name: string): Promise<Stage[]>{
    return this.table.where("name").startsWithIgnoreCase(name).toArray();
  }

  public findByFilter(filter: StageFilter): Promise<Stage[]>{
    let stageFilter = new StageRepositoryFilter(filter);
    return this.table.filter(stage=>stageFilter.apply(stage)).toArray();
  }

  public insert(stage: Stage): Promise<number>{
    let preparedStage = this.getPreparedStage(stage);
    return this.table.add(preparedStage);
  }

  public remove(id: number): Promise<void>{
    return this.table.delete(id);
  }

  public update(stage: Stage): Promise<number>{
    let preparedStage = this.getPreparedStage(stage);
    return this.table.update(stage.id, preparedStage);
  }

  private getPreparedStage(stage: Stage): Stage{
    const newStage = new Stage();
    if (stage.id) {
      newStage.id = stage.id;
    }
    newStage.name = stage.name;
    newStage.description = stage.description;
    newStage.endDate = stage.endDate;
    newStage.status = stage.status;
    newStage.projectID = stage.projectID;
    newStage.position = stage.position;
    newStage.successorId = stage.successorId;

    return newStage;
  }
}
