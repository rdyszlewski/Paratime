import { Project } from "app/database/data/models/project";
import { Status } from 'app/database/data/models/status';
import { ProjectFilter } from 'app/database/filter/project.filter';
import { RepositoryFilter } from './local.repository-filter';

export class ProjectRepositoryFilter extends RepositoryFilter<Project, ProjectFilter>{

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
      this.addCondition(project=>project["startDate"] == filter.startDate);
    }
    if(filter.endDate != null){
      this.addCondition(project=>project["endDate"] == filter.endDate);
    }
  }
}
