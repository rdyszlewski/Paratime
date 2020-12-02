import { Label } from '../data/models/label';

export class LabelInsertResult{
  private _insertedLabel: Label;
  private _updatedlabels: Label[];

  constructor(insertedLabel: Label){
    this._insertedLabel = insertedLabel;
  }

  public get insertedLabel():Label{
    return this._insertedLabel;
  }

  public get updatedLabels(): Label[]{
    return this._updatedlabels;
  }

  public set updatedLabels(labels: Label[]){
    this._updatedlabels = labels;
  }
}
