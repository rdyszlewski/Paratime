import { Stage } from 'app/data/models/stage';
import { IOrderableRepository } from './orderable.repository';

export interface IProjectStageRepository extends IOrderableRepository<Stage> {
  findById(id: number): Promise<Stage>;
  findByProject(projectId: number): Promise<Stage[]>;
  findByName(name: string): Promise<Stage[]>;
  insertStage(stage: Stage): Promise<number>;
  update(stage: Stage): Promise<number>;
  remove(id: number): Promise<void>;
}
