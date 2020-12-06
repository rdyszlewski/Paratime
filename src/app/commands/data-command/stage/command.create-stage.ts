import { DataCommand } from 'app/commands/data-commnad';
import { Stage } from 'app/database/shared/stage/stage';
import { ProjectDetails } from 'app/tasks/details-container/project-details/model/model';

export class CreateStageCommand extends DataCommand{

  constructor(private stage: Stage, private model: ProjectDetails,private  closeCallback:()=>void){
    super();
  }

  public execute() {
    this._dataService.getStageService().create(this.stage).then(result=>{
      this.model.updateStages(result.updatedElements);
      this.closeCallback();
    });
  }

  unExecute() {
    throw new Error('Method not implemented.');
  }

  getDescription(): string {
    return `Dodanie etapu ${this.stage.getName()}`;
  }

}
