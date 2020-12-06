import { DataCommand } from 'app/commands/data-commnad';
import { Stage } from 'app/database/shared/stage/stage';
import { ProjectDetails } from 'app/tasks/details-container/project-details/model/model';
import { ProjectsModel } from 'app/tasks/lists-container/projects/common/model';

export class RemoveStageCommand extends DataCommand{

  constructor(private stage: Stage, private model: ProjectDetails){
    super();
  }

  public execute() {
    this._dataService.getStageService().remove(this.stage.getId()).then(updatedStages=>{
      this.model.updateStages(updatedStages);
    });
  }

  unExecute() {
    throw new Error('Method not implemented.');
  }
  getDescription(): string {
    return `Usunięcie etapu ${this.stage.getName()}`;
  }


}
