import { DataCommand } from 'app/commands/data-commnad';
import { LabelsModel } from 'app/shared/side-container/labels/common/list.model';

export class ChangeLabelsOrderCommand extends DataCommand{

  constructor(private currentIndex, private previousIndex,private model: LabelsModel){
    super();
  }

  public execute() {
    const currentLabel = this.model.getLabelByIndex(this.currentIndex);
    const previousLabel = this.model.getLabelByIndex(this.previousIndex);
    this._dataService.getLabelService().changeOrder(currentLabel, previousLabel, this.currentIndex, this.previousIndex).then(updatedLabels=>{
      this.model.updateLabels(updatedLabels);
    });
  }

  unExecute() {
    throw new Error('Method not implemented.');
  }

  public getDescription(): string {
    return `Zmiana kolejności etykiet`;
  }
}
