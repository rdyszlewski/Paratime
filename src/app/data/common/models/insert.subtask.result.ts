import { Subtask } from 'app/models/subtask';

export class InsertSubtaskResult {
  private _insertedSubtask: Subtask;
  private _updatedSubstask: Subtask[];

  public get insertedSubtask(): Subtask {
    return this._insertedSubtask;
  }
  public set insertedSubtask(value: Subtask) {
    this._insertedSubtask = value;
  }
  public get updatedSubstask(): Subtask[] {
    return this._updatedSubstask;
  }
  public set updatedSubstask(value: Subtask[]) {
    this._updatedSubstask = value;
  }
}
