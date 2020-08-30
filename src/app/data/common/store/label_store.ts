import { ITaskLabelsRepository } from '../repositories/task_labels_repository';
import { ILabelRepository } from '../repositories/label_repository';
import { Label } from 'app/data/models/label';
import { LabelsTask } from '../models';
import { IOrderableStore } from './orderable.store';
import { StoreOrderController } from '../order/order.controller';

export class LabelStore implements IOrderableStore<Label> {
  private labelRepository: ILabelRepository;
  private taskLabelsRepository: ITaskLabelsRepository;
  private orderController: StoreOrderController<Label>;

  constructor(
    labelRepository: ILabelRepository,
    taskLabelsRepository: ITaskLabelsRepository
  ) {
    this.labelRepository = labelRepository;
    this.taskLabelsRepository = taskLabelsRepository;

    this.orderController = new StoreOrderController(this.labelRepository);
  }

  public getLabelById(id: number): Promise<Label> {
    return this.labelRepository.findById(id);
  }

  public getLabelByName(name: string): Promise<Label> {
    return this.labelRepository.findByName(name);
  }

  public getAllLabel(): Promise<Label[]> {
    return this.labelRepository.findAll();
  }

  public createLabel(label: Label): Promise<Label[]> {
    return this.labelRepository.insert(label).then((insertedId) => {
      return this.getLabelById(insertedId).then((insertedLabel) => {
        return this.orderController.insert(insertedLabel, null, null);
      });
    });
  }

  public connectTaskAndLabel(
    taskId: number,
    labelId: number
  ): Promise<LabelsTask> {
    return this.taskLabelsRepository.insert(new LabelsTask(taskId, labelId));
  }

  public updateLabel(label: Label): Promise<Label> {
    // TODO: sprawdzić, czy nie będzie trzeba zmienić wyniku po then
    return this.labelRepository.update(label).then(() => {
      return Promise.resolve(label);
    });
  }

  public removeLabel(labelId): Promise<Label[]> {
    // TODO: sprawdzić, czy działa poprawnie
    return this.taskLabelsRepository.removeByLabelId(labelId).then(() => {
      return this.labelRepository.findById(labelId).then((label) => {
        return this.labelRepository.remove(labelId).then(() => {
          return this.orderController.remove(label);
        });
      });
    });
  }

  public getLabelsByTask(taskId): Promise<Label[]> {
    return this.taskLabelsRepository.findByTaskId(taskId).then((entries) => {
      let promises = [];
      entries.forEach((entry) => {
        let promise = this.labelRepository.findById(entry.getLabelId());
        promises.push(promise);
      });
      return Promise.all(promises);
    });
  }

  public removeTaskLabels(taskId: number): Promise<void> {
    return this.taskLabelsRepository.removeByTaskId(taskId);
  }

  public removeLabelFromTask(taskId: number, labelId: number): Promise<void> {
    return this.taskLabelsRepository.remove(new LabelsTask(taskId, labelId));
  }

  public move(
    previousItem: Label,
    currentItem: Label,
    moveUp: boolean
  ): Promise<Label[]> {
    return this.orderController.move(previousItem, currentItem, moveUp);
  }

  public changeContainer(
    item: Label,
    currentItem: Label,
    currentContainerId: number
  ): Promise<Label[]> {
    return this.orderController.changeContainer(
      item,
      currentItem,
      currentContainerId
    );
  }
}
