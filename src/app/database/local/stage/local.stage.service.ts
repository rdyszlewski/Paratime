import { InsertResult } from 'app/database/shared/insert-result';
import { Stage } from 'app/database/shared/stage/stage';
import { StageFilter } from 'app/database/shared/stage/stage.filter';
import { IProjectStageService } from 'app/database/shared/stage/stage.service';
import { LocalOrderController } from '../order/local.orderable.service';
import { LocalProjectStageRepository } from './local.stage.repository';


export class LocalProjectStageService implements IProjectStageService{

  private orderController: LocalOrderController<Stage>;

  constructor(private repository: LocalProjectStageRepository){
    this.orderController = new LocalOrderController(repository);
  }

  public getById(id: number): Promise<Stage> {
    return this.repository.findById(id);
  }

  public getByName(name: string): Promise<Stage[]> {
    return this.repository.findByName(name);
  }

  public getByFilter(filter: StageFilter): Promise<Stage[]> {
    return this.repository.findByFilter(filter);
  }

  public create(stage: Stage): Promise<InsertResult<Stage>> {
    return this.insert(stage).then(insertedStage=>{
      return this.orderInsertedStage(insertedStage);
    });
  }

  private insert(stage: Stage): Promise<Stage>{
    return this.repository.insert(stage).then(insertedId=>{
      return this.repository.findById(insertedId);
    });
  }

  private orderInsertedStage(stage: Stage): Promise<InsertResult<Stage>>{
    return this.orderController.insert(stage, null, stage.containerId).then(updatedStages=>{
      let result = new InsertResult(stage);
      result.updatedElements = updatedStages;
      return Promise.resolve(result);
    });
  }

  public remove(stageId: number): Promise<Stage[]> {
    return this.orderRemoveStage(stageId).then(updatedStages=>{
      return this.repository.remove(stageId).then(()=>{
        return Promise.resolve(updatedStages);
      });
    });
  }

  private orderRemoveStage(stageId: number): Promise<Stage[]>{
    return this.repository.findById(stageId).then(stage=>{
      return this.orderController.remove(stage);
    });
  }

  public update(stage: Stage): Promise<Stage> {
    return this.repository.update(stage).then(_=>{
      return Promise.resolve(stage);
    });
  }

  public changeOrder(currentStage: Stage, previousStage: Stage, currentIndex: number, previousIndex: number): Promise<Stage[]> {
    return this.orderController.move(currentStage, previousStage, currentIndex, previousIndex);
  }
}
