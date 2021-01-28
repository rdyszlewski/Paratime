import { InsertResult } from 'app/database/shared/insert-result';
import { Stage } from 'app/database/shared/stage/stage';
import { StageFilter } from 'app/database/shared/stage/stage.filter';
import { IProjectStageService } from 'app/database/shared/stage/stage.service';
import { LocalOrderController } from '../order/local.orderable.service';
import { DexieStageDTO } from './local.stage';
import { LocalProjectStageRepository } from './local.stage.repository';


export class LocalProjectStageService implements IProjectStageService{

  private orderController: LocalOrderController<DexieStageDTO>;

  constructor(private repository: LocalProjectStageRepository){
    this.orderController = new LocalOrderController(repository);
  }

  public getById(id: number): Promise<Stage> {
    let action = this.repository.findById(id);
    return this.mapToStageAction(action);
  }

  public getByName(name: string): Promise<Stage[]> {
    let promise =  this.repository.findByName(name);
    return this.mapToStageListAction(promise);
  }

  private mapToStageAction(action: Promise<DexieStageDTO>): Promise<Stage>{
    return action.then(result=>{
      return Promise.resolve(result.getModel());
    })
  }

  private mapToStageListAction(dtoPromise: Promise<DexieStageDTO[]>): Promise<Stage[]>{
    return dtoPromise.then(result=>{
      return Promise.resolve(result.map(x=>x.getModel()));
    })
  }

  public getByFilter(filter: StageFilter): Promise<Stage[]> {
    let promise = this.repository.findByFilter(filter);
    return this.mapToStageListAction(promise);
  }

  public create(stage: Stage): Promise<InsertResult<Stage>> {
    let dto = new DexieStageDTO(stage);
    return this.insert(dto).then(insertedStage=>{
      return this.orderInsertedStage(insertedStage);
    });
  }

  private insert(stage: DexieStageDTO): Promise<DexieStageDTO> {
    return this.repository.insert(stage).then(insertedId=>{
      return this.repository.findById(insertedId);
    });
  }

  private orderInsertedStage(stage: DexieStageDTO): Promise<InsertResult<Stage>>{
    return this.orderController.insert(stage, null, stage.containerId).then(updatedStages=>{
      let result = new InsertResult(stage.getModel());
      result.updatedElements = updatedStages.map(x=>x.getModel());
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
      let promise =  this.orderController.remove(stage);
      return this.mapToStageListAction(promise);
    });
  }

  public update(stage: Stage): Promise<Stage> {
    return this.repository.findById(stage.id).then(stageDTO=>{
      stageDTO.update(stage);
      return this.repository.update(stageDTO).then(_=>{
        return Promise.resolve(stage);
      });
    });
  }

  public changeOrder(currentStage: Stage, previousStage: Stage, currentIndex: number, previousIndex: number): Promise<Stage[]> {
    let promises = [
      this.repository.findById(currentStage.id),
      this.repository.findById(previousStage.id)
    ];
    return Promise.all(promises).then(results=>{
      let promise =  this.orderController.move(results[0], results[1], currentIndex, previousIndex);
      return this.mapToStageListAction(promise);
    });
  }
}
