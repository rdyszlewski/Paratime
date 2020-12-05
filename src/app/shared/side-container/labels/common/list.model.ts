import { Label } from 'app/database/shared/label/label';
import { TasksList } from 'app/shared/common/lists/tasks.list';

export class LabelsModel {
  private labels: TasksList<Label> = new TasksList();

  public getLabels(): Label[] {
    return this.labels.getItems();
  }

  public setLabels(labels: Label[]) {
    this.labels.setItems(labels);
  }

  public getLabelByIndex(index: number): Label {
    return this.labels.getItemByIndex(index);
  }

  public updateLabels(labels: Label[]) {
    this.labels.updateItems(labels);
    // TODO: być może w modelach też będzie trzeba to pozmieniać
  }

  public filterLabels(filter: string) {
    this.labels.filter(filter);
  }
}
