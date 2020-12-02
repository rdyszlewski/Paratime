import { Stage } from '../data/models/stage';
import { RepositoryFilter } from './local.repository-filter';
import { StageFilter } from './stage.filter';

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
