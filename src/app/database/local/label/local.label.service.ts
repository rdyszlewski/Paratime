import { ILabelService } from 'app/database/shared/label/label.service';
import { Label } from 'app/database/shared/label/label';
import { LabelsTask } from 'app/database/shared/label/labels-task';
import { LocalTaskLabelsRepository } from './local.task-labels.repository';
import { InsertResult } from 'app/database/shared/insert-result';
import { LocalOrderController } from '../order/local.orderable.service';
import { LocalLabelRepository } from './local.label.repository';


export class LocalLabelService implements ILabelService{

  private orderController: LocalOrderController<Label>;

  constructor(private repository: LocalLabelRepository,
    private taskLabelsRepository: LocalTaskLabelsRepository){
    this.orderController = new LocalOrderController(repository);
  }

  public getById(id: number): Promise<Label> {
    return this.repository.findById(id);
  }

  public getByName(name: string): Promise<Label[]> {
    return this.repository.findByName(name);
  }

  public getAll(): Promise<Label[]> {
    return this.repository.findAll();
  }

  public create(label: Label): Promise<InsertResult<Label>> {
    return this.insertLabel(label).then(createdLabel=>{
      return this.orderInsertLabel(createdLabel);
    });
  }

  private insertLabel(label: Label): Promise<Label>{
    return this.repository.insert(label).then(insertedId=>{
      return this.repository.findById(insertedId);
    })
  }

  private orderInsertLabel(label: Label): Promise<InsertResult<Label>>{
    return this.orderController.insert(label, null, null).then(updatedLabels=>{
      let result = new InsertResult(label);
      result.updatedElements = updatedLabels;
      return Promise.resolve(result);
    });
  }

  public remove(label: Label): Promise<Label[]> {
    return this.orderRemoveStage(label.getId()).then(updatedLabels=>{
      return this.repository.remove(label).then(()=>{
        return Promise.resolve(updatedLabels);
      });
    });
  }

  private orderRemoveStage(labelId: number): Promise<Label[]>{
    return this.repository.findById(labelId).then(stage=>{
      return this.orderController.remove(stage);
    });
  }

  public update(label: Label): Promise<Label> {
    return this.repository.update(label).then(_=>{
      return Promise.resolve(label);
    });
  }

  public changeOrder(currentLabel: Label, previousLabel: Label, currentIndex: number, previousIndex: number) {
    return this.orderController.move(currentLabel, previousLabel, currentIndex, previousIndex);
  }

  // =======

  public assginLabel(taskId: number, labelId: number): Promise<LabelsTask> {
    return this.taskLabelsRepository.insert(new LabelsTask(taskId, labelId)).then(insertedId=>{
      return this.taskLabelsRepository.findById(insertedId);
    });
  }

  public setAssignedLabels(taskId: number, labels: Label[]): Promise<LabelsTask[]>{
    /// first we remvoe all assigned labels, later add new collection of labels.
    // This is nessessery, to not checking which label is already assinged and wchich is not anymore assgined
    return this.removeAllAssigningFromTask(taskId).then(_=>{
      let actions = labels.map(label=>this.assginLabel(taskId, label.getId()));
      return Promise.all(actions);
    });
  }

  public getLabelsByTask(taskId: number): Promise<Label[]> {
    return this.taskLabelsRepository.findByTaskId(taskId).then((entries)=>{
      let promises = entries.map(entry=>this.repository.findById(entry.getLabelId()));
      return Promise.all(promises);
    })
  }

  public removeAllAssigningFromTask(taskId: number): Promise<number> {
    return this.taskLabelsRepository.removeByTaskId(taskId);
  }

  public removeAssigning(taskId: number, labelId: number): Promise<void> {
    return this.taskLabelsRepository.remove(new LabelsTask(taskId, labelId));
  }
}
