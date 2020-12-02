import { IProjectStageService } from 'app/database/common/stage.service';
import { Stage } from 'app/database/data/models/stage';
import { StageFilter } from 'app/database/filter/stage.filter';
import { StageInsertResult } from 'app/database/model/stage.insert-result';
import { LocalProjectStageRepository } from '../repository/local.stage.repository';
import { LocalOrderController } from './local.orderable.service';

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

  public create(stage: Stage): Promise<StageInsertResult> {
    return this.insert(stage).then(insertedStage=>{
      return this.orderInsertedStage(insertedStage);
    });
  }

  private insert(stage: Stage): Promise<Stage>{
    return this.repository.insert(stage).then(insertedId=>{
      return this.repository.findById(insertedId);
    });
  }

  private orderInsertedStage(stage: Stage): Promise<StageInsertResult>{
    return this.orderController.insert(stage, null, stage.getContainerId()).then(updatedStages=>{
      let result = new StageInsertResult(stage);
      result.updatedStages = updatedStages;
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
