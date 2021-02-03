import { DateAdapter } from 'app/database/shared/models/date.adapter';
import { Status } from 'app/database/shared/models/status';
import { ProjectFilter } from 'app/database/shared/project/project.filter';
import { RepositoryFilter } from '../pomodoro/local.repository-filter';
import { DexieProjectDTO } from './local.project';


export class ProjectRepositoryFilter extends RepositoryFilter<DexieProjectDTO, ProjectFilter>{

  constructor(filter: ProjectFilter){
    super(filter);
  }

  protected init(filter: ProjectFilter):void{
    if(filter.name != null){
      this.addCondition(project=>project["name"].includes(filter.name));
    }
    if(filter.description!=null){
      this.addCondition(project=>project["description"]==filter.description);
    }
    if(filter.finished){
      this.addCondition(project=>project["status"] == Status.ENDED);
    }
    if(filter.startDate != null){
      let dateText = DateAdapter.getText(filter.startDate);
      this.addCondition(project=>project["startDate"] == dateText);
    }
    if(filter.endDate != null){
      let dateText = DateAdapter.getText(filter.endDate);
      this.addCondition(project=>project["endDate"] == dateText);
    }
  }
}
