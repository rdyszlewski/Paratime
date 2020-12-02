import { Stage } from '../data/models/stage';

export class StageInsertResult{
  private _insertedStage: Stage;
  private _updatedStages: Stage[];

  constructor(insertedStage: Stage){
    this._insertedStage = insertedStage;
  }

  public get insertedStage(): Stage{
    return this._insertedStage;
  }

  public get updatedStages(): Stage[]{
    return this._updatedStages;
  }

  public set updatedStages(stages: Stage[]){
    this._updatedStages = stages;
  }
}
