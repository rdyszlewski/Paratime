import { IProjectStageRepository } from '../repositories/stage_repository';
import { Stage } from 'app/data/models/stage';
import { IOrderableStore } from './orderable.store';
import { StoreOrderController } from '../order/order.controller';

export class StageStore implements IOrderableStore<Stage> {
  private stageRepository: IProjectStageRepository;
  private orderController: StoreOrderController<Stage>;

  constructor(stageRepository: IProjectStageRepository) {
    this.stageRepository = stageRepository;
    this.orderController = new StoreOrderController(this.stageRepository);
  }

  public getStageById(id: number): Promise<Stage> {
    // TODO: można uzupełnić projekt jeśli będzie taka potrzeba
    return this.stageRepository.findById(id);
  }

  public getStagesByProject(projectId: number): Promise<Stage[]> {
    return this.stageRepository.findByProject(projectId);
  }

  public getStagesByName(name: string): Promise<Stage[]> {
    return this.stageRepository.findByName(name);
  }

  public createStage(stage: Stage): Promise<Stage[]> {
    return this.stageRepository.insertStage(stage).then((insertedId) => {
      return this.getStageById(insertedId).then((insertedStage) => {
        return this.orderController
          .insert(insertedStage, null, insertedStage.getContainerId())
          .then((updatedStages) => {
            return Promise.resolve(updatedStages);
          });
      });
    });
  }

  public updateStage(stage: Stage): Promise<Stage> {
    return this.stageRepository.update(stage).then((result) => {
      return Promise.resolve(stage);
    });
  }

  public removeStage(stageId: number): Promise<Stage[]> {
    return this.stageRepository.findById(stageId).then((stage) => {
      return this.stageRepository.remove(stageId).then(() => {
        return this.orderController.remove(stage).then((updatedStages) => {
          return Promise.resolve(updatedStages);
        });
      });
    });
  }

  public removeStagesFromProject(projectId: number): Promise<void> {
    // TODO: przetestować to
    // TODO: podczas usuwania projektu usunąć wszystkie etapy
    return this.getStagesByProject(projectId).then((results) => {
      return results.forEach((stage) => {
        this.removeStage(stage.getId());
      });
    });
  }

  public move(
    previousItem: Stage,
    currentItem: Stage,
    moveUp: boolean
  ): Promise<Stage[]> {
    return this.orderController.move(previousItem, currentItem, moveUp);
  }

  public changeContainer(
    item: Stage,
    currentTask: Stage,
    currentContainerId: number
  ): Promise<Stage[]> {
    return this.orderController.changeContainer(
      item,
      currentTask,
      currentContainerId
    );
  }
}
