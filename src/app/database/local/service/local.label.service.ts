import { ILabelService } from 'app/database/common/label.service';
import { LabelsTask } from 'app/database/data/common/models';
import { Label } from 'app/database/data/models/label';
import { LabelInsertResult } from 'app/database/model/label.insert-result';
import { TaskEntry } from 'app/summary/pomodoro-statistics/model';
import { LocalLabelRepository } from '../repository/local.label.repository';
import { LocalTaskLabelsRepository } from '../repository/local.task-labels.repository';
import { LocalOrderController } from './local.orderable.service';

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

  public create(label: Label): Promise<LabelInsertResult> {
    return this.insertLabel(label).then(createdLabel=>{
      return this.orderInsertLabel(createdLabel);
    });
  }

  private insertLabel(label: Label): Promise<Label>{
    return this.repository.insert(label).then(insertedId=>{
      return this.repository.findById(insertedId);
    })
  }

  private orderInsertLabel(label: Label): Promise<LabelInsertResult>{
    return this.orderController.insert(label, null, null).then(updatedLabels=>{
      let result = new LabelInsertResult(label);
      result.updatedLabels = updatedLabels;
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
