import { Stage } from './stage';
import { StageFilter } from './stage.filter';
import { InsertResult } from '../insert-result';

export interface IProjectStageService{
  getById(id: number): Promise<Stage>;
  getByName(namge: string): Promise<Stage[]>;
  getByFilter(filter: StageFilter): Promise<Stage[]>;
  create(stage: Stage): Promise<InsertResult<Stage>>;
  /// return: stages in which changed order
  remove(stageId: number): Promise<Stage[]>;
  update(stage: Stage): Promise<Stage>;
  changeOrder(currentStage: Stage, previousStage: Stage, currentIndex: number, previousIndex: number): Promise<Stage[]>;
}
