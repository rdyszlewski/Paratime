import { DateAdapter } from 'app/database/shared/models/date.adapter';
import { Stage } from 'app/database/shared/stage/stage';
import { StageFilter } from 'app/database/shared/stage/stage.filter';
import { RepositoryFilter } from '../pomodoro/local.repository-filter';
import { DexieStageDTO } from './local.stage';

export class StageRepositoryFilter extends RepositoryFilter<DexieStageDTO, StageFilter>{

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
      let date = DateAdapter.getText(filter.startDate);
      this.addCondition(stage=>stage["startDate"] == date);
    }
    if(filter.endDate!=null){
      let date = DateAdapter.getText(filter.endDate);
      this.addCondition(stage=>stage["endDate"] == date);
    }
    if(filter.status!=null){
      this.addCondition(stage=>stage["status"] == filter.status);
    }
  }

}
