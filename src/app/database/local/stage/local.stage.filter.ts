import { Stage } from 'app/database/shared/stage/stage';
import { StageFilter } from 'app/database/shared/stage/stage.filter';
import { RepositoryFilter } from '../pomodoro/local.repository-filter';

export class StageRepositoryFilter extends RepositoryFilter<Stage, StageFilter>{

  protected init(filter: StageFilter) {
    if(filter.projectId !=null){
      this.addCondition(stage=>{
        console.log(stage);
        return stage["projectID"] == filter.projectId;
      });
    }
    if(filter.name != null){
      this.addCondition(stage=>stage["name"].includes(filter.name));
    }
    if(filter.startDate!=null){
      // TODO: prawdopoodbnie będzie trzeba to zrobić inaczej
      this.addCondition(stage=>stage["startDate"] == filter.startDate);
    }
    if(filter.endDate!=null){
      this.addCondition(stage=>stage["endDate"] == filter.endDate);
    }
    if(filter.status!=null){
      this.addCondition(stage=>stage["status"] == filter.status);
    }
  }

}
