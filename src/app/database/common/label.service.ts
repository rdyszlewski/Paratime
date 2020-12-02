import { LabelsTask } from '../data/common/models';
import { Label } from '../data/models/label';
import { LabelInsertResult } from '../model/label.insert-result';

export interface ILabelService{
  getById(id: number): Promise<Label>;
  getByName(name: string): Promise<Label[]>;
  getAll():Promise<Label[]>;
  create(label:Label):Promise<LabelInsertResult>;
  remove(label:Label): Promise<Label[]>;
  update(label:Label): Promise<Label>;
  changeOrder(currentLabel: Label, previousLabel: Label, currentIndex: number, previousIndex: number);

  assginLabel(taskId: number, labelId:number): Promise<LabelsTask>;
  getLabelsByTask(taskId: number): Promise<Label[]>;
  removeAllAssigningFromTask(taskId: number): Promise<number>;
  removeAssigning(taskId: number, labelId: number): Promise<void>;
}
