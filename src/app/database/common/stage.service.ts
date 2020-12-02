import { Stage } from '../data/models/stage';
import { StageFilter } from '../filter/stage.filter';
import { StageInsertResult } from '../model/stage.insert-result';

export interface IProjectStageService{
  getById(id: number): Promise<Stage>;
  getByName(namge: string): Promise<Stage[]>;
  getByFilter(filter: StageFilter): Promise<Stage[]>;
  create(stage: Stage): Promise<StageInsertResult>;
  /// return: stages in which changed order
  remove(stageId: number): Promise<Stage[]>;
  update(stage: Stage): Promise<Stage>;
  changeOrder(currentStage: Stage, previousStage: Stage, currentIndex: number, previousIndex: number): Promise<Stage[]>;
}
