import { ILabelService } from 'app/database/shared/label/label.service';
import { Label } from 'app/database/shared/label/label';
import { LabelsTask } from 'app/database/shared/label/labels-task';
import { LocalTaskLabelsRepository } from './local.task-labels.repository';
import { InsertResult } from 'app/database/shared/insert-result';
import { LocalOrderController } from '../order/local.orderable.service';
import { LabelDTO, LocalLabelRepository } from './local.label.repository';
import { DexieLabelDTO } from './local.label';


export class LocalLabelService implements ILabelService{

  private orderController: LocalOrderController<LabelDTO>;

  constructor(private repository: LocalLabelRepository,
    private taskLabelsRepository: LocalTaskLabelsRepository){
    this.orderController = new LocalOrderController(repository);
  }

  public getById(id: number): Promise<Label> {
    let action = this.repository.findById(id);
    return this.mapToLabelAction(action);
  }

  private mapToLabelAction(action: Promise<LabelDTO>) : Promise<Label>{
    return action.then(result=>{
      return Promise.resolve(result.getModel());
    });
  }

  public getByName(name: string): Promise<Label[]> {
    let action = this.repository.findByName(name);
    return this.mapToLabelsListAction(action);
  }

  private mapToLabelsListAction(action: Promise<LabelDTO[]>) : Promise<Label[]>{
    return action.then(results=>{
      return Promise.resolve(results.map(x=>x.getModel()));
    })
  }

  public getAll(): Promise<Label[]> {
    let action = this.repository.findAll();
    return this.mapToLabelsListAction(action);
  }

  public create(label: Label): Promise<InsertResult<Label>> {
    return this.insertLabel(label).then(createdLabel=>{
      return this.orderInsertLabel(createdLabel);
    });
  }

  private insertLabel(label: Label): Promise<LabelDTO>{
    let dto = new DexieLabelDTO(label);
    return this.repository.insert(dto).then(insertedId=>{
      return this.repository.findById(insertedId);
    })
  }

  private orderInsertLabel(label: LabelDTO): Promise<InsertResult<Label>>{
    return this.orderController.insert(label, null, null).then(updatedLabels=>{
      let result = new InsertResult(label.getModel());
      result.updatedElements = updatedLabels.map(x=>x.getModel());
      return Promise.resolve(result);
    });
  }

  public remove(label: Label): Promise<Label[]> {
    return this.orderRemoveStage(label.id).then(updatedLabels=>{
      return this.repository.remove(label.id).then(()=>{
        return Promise.resolve(updatedLabels.map(x=>x.getModel()));
      });
    });
  }

  private orderRemoveStage(labelId: number): Promise<DexieLabelDTO[]>{
    return this.repository.findById(labelId).then(stage=>{
      return this.orderController.remove(stage);
    });
  }

  public update(label: Label): Promise<Label> {
    return this.repository.findById(label.id).then(dto=>{
      return this.repository.update(dto).then(_=>{
        return Promise.resolve(label);
      });
    })
  }

  public changeOrder(currentLabel: Label, previousLabel: Label, currentIndex: number, previousIndex: number) {
    let actions = [
      this.repository.findById(currentLabel.id),
      this.repository.findById(previousLabel.id)
    ]
    return Promise.all(actions).then(results=>{
      return this.orderController.move(results[0], results[1], currentIndex, previousIndex);
    });
  }

  // =======

  public assginLabel(taskId: number, labelId: number): Promise<number> {
    return this.taskLabelsRepository.insert(new LabelsTask(taskId, labelId));
    // return this.taskLabelsRepository.insert(new LabelsTask(taskId, labelId)).then(insertedId=>{
    //   return this.taskLabelsRepository.findById(insertedId);
    // });
  }

  public setAssignedLabels(taskId: number, labels: Label[]): Promise<Label[]>{
    /// first we remvoe all assigned labels, later add new collection of labels.
    // This is nessessery to not checking which label is already assinged and wchich is not anymore assgined
    return this.removeAllAssigningFromTask(taskId).then(_=>{
      let actions = labels.map(label=>this.assginLabel(taskId, label.id));
      return Promise.all(actions).then(results=>{
        return Promise.resolve(labels);
      });
    });
  }

  public getLabelsByTask(taskId: number): Promise<Label[]> {
    return this.taskLabelsRepository.findByTaskId(taskId).then((entries)=>{
      let promises = entries.map(entry=>this.repository.findById(entry.labelId));
      return Promise.all(promises).then(results=>{
        return Promise.resolve(results.map(x=>x.getModel()));
      });
    })
  }

  public removeAllAssigningFromTask(taskId: number): Promise<number> {
    return this.taskLabelsRepository.removeByTaskId(taskId);
  }

  public removeAssigning(taskId: number, labelId: number): Promise<void> {
    return this.taskLabelsRepository.remove(new LabelsTask(taskId, labelId));
  }
}
