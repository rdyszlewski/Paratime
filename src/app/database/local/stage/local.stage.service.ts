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
    return this.repository.findById(id).then(result=>{
      return Promise.resolve(result.getModel());
    });
  }

  public getByName(name: string): Promise<Stage[]> {
    let promise =  this.repository.findByName(name);
    return this.mapToStage(promise);
  }

  private mapToStage(dtoPromise: Promise<DexieStageDTO[]>): Promise<Stage[]>{
    return dtoPromise.then(result=>{
      return Promise.resolve(result.map(x=>x.getModel()));
    })
  }

  public getByFilter(filter: StageFilter): Promise<Stage[]> {
    let promise = this.repository.findByFilter(filter);
    return this.mapToStage(promise);
  }

  public create(stage: Stage): Promise<InsertResult<Stage>> {
    return this.insert(stage).then(insertedStage=>{
      return this.orderInsertedStage(insertedStage);
    });
  }

  private insert(stage: Stage): Promise<Stage>{
    let dto = new DexieStageDTO(stage);
    return this.repository.insert(dto).then(insertedId=>{
      return this.repository.findById(insertedId).then(result=>{
        return Promise.resolve(result.getModel());
      });
    });
  }

  private orderInsertedStage(stage: Stage): Promise<InsertResult<Stage>>{
     let dto = new DexieStageDTO(stage);
     //TODO: przyjrzeć się temu, czy wszystko jest zrobione poprawnie
    return this.orderController.insert(dto, null, stage.containerId).then(updatedStages=>{
      let result = new InsertResult(stage);
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
      return this.mapToStage(promise);
    });
  }

  public update(stage: Stage): Promise<Stage> {
    // TODO: tutaj uważać na aktualizacje. Mogą się zastapić informacje o kolejności
    let dto = new DexieStageDTO(stage);
    return this.repository.update(dto).then(_=>{
      return Promise.resolve(stage);
    });
  }

  public changeOrder(currentStage: Stage, previousStage: Stage, currentIndex: number, previousIndex: number): Promise<Stage[]> {
    let promises = [
      this.repository.findById(currentStage.id),
      this.repository.findById(previousStage.id)
    ];
    return Promise.all(promises).then(results=>{
      let promise =  this.orderController.move(results[0], results[1], currentIndex, previousIndex);
      return this.mapToStage(promise);
    });
  }
}
