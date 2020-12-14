import { DataCommand } from 'app/commands/data-commnad';
import { ProjectDetails } from 'app/tasks/details-container/project-details/model/model';

export class ChangeStageOrderCommand extends DataCommand{

  constructor(private currentIndex: number, private previousIndex: number, private model: ProjectDetails ){
    super();
  }

  public execute() {
    const currentStage = this.model.getStageByIndex(this.currentIndex);
    const previousStage = this.model.getStageByIndex(this.previousIndex);
    this._dataService.getStageService().changeOrder(currentStage, previousStage, this.currentIndex, this.previousIndex).then(updatedStages=>{
      this.model.updateStages(updatedStages);
    });
  }

  unExecute() {
    throw new Error('Method not implemented.');
  }

  public getDescription(): string {
    return `Zmiana kolejności etapów`;
  }
}
