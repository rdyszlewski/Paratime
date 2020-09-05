import { IProjectStageRepository } from 'app/database/data/common/repositories/stage_repository';
import { Stage } from 'app/database/data/models/stage';
import { OrderRepository } from 'app/database/data/common/repositories/orderable.repository';

export class LocalProjectStageRepository implements IProjectStageRepository {
  private table: Dexie.Table<Stage, number>;
  private orderRepository: OrderRepository<Stage>;

  constructor(table: Dexie.Table<Stage, number>) {
    this.table = table;
    this.orderRepository = new OrderRepository(table, 'projectID');
  }

  public findById(id: number): Promise<Stage> {
    return this.table.get(id);
  }

  public findByProject(projectId: number): Promise<Stage[]> {
    return this.table.where('projectID').equals(projectId).toArray();
  }

  public findByName(name: string): Promise<Stage[]> {
    return this.table.where('name').startsWithIgnoreCase(name).toArray();
  }

  public insertStage(stage: Stage): Promise<number> {
    const stageToSave = this.getStageCopyToSave(stage);
    return this.table.add(stageToSave);
  }

  // TODO: być możę warto by było to gdzieś przenieść
  private getStageCopyToSave(stage: Stage) {
    const newStage = new Stage();
    if (stage.getId()) {
      newStage.setId(stage.getId());
    }
    newStage.setName(stage.getName());
    newStage.setDescription(stage.getDescription());
    newStage.setEndDate(stage.getEndDate());
    newStage.setStatus(stage.getStatus());
    newStage.setProjectID(stage.getProjectID());
    newStage.setPosition(stage.getPosition());
    newStage.setSuccessorId(stage.getSuccessorId());

    return newStage;
  }

  public update(stage: Stage): Promise<number> {
    const stageToUpdate = this.getStageCopyToSave(stage);
    return this.table.update(stageToUpdate.getId(), stageToUpdate);
  }

  public remove(id: number): Promise<void> {
    return this.table.delete(id);
  }

  public findBySuccessor(successorId: number): Promise<Stage> {
    return this.orderRepository.findBySuccessor(successorId);
  }

  public findFirst(containerId: number): Promise<Stage> {
    return this.orderRepository.findFirst(containerId);
  }

  public findLast(containerId: number, exceptItem: number): Promise<Stage> {
    return this.orderRepository.findLast(containerId, exceptItem);
  }
}
