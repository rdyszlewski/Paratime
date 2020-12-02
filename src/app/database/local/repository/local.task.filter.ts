import { Status } from 'app/database/data/models/status';
import { Task } from 'app/database/data/models/task';
import { TaskFilter } from 'app/database/filter/task.filter';
import { RepositoryFilter } from './local.repository-filter';

export class TaskRepositoryFilter extends RepositoryFilter<Task, TaskFilter>{

  constructor(filter: TaskFilter){
    super(filter);
  }

  protected init(filter: TaskFilter):void {
    if(filter.projectId != null){
      this.addCondition(task=>task.getProjectID() == filter.projectId);
    }
    if(filter.active){
      this.addCondition(task=>task.getStatus()==Status.STARTED);
    }
    if(filter.finished){
      this.addCondition(task=>task.getStatus()==Status.ENDED);
    }
    if(filter.important){
      this.addCondition(task=>task.isImportant());
    }
    if(filter.startDate != null){
      // TODO: prawdopodobnie będzie trzeba inaczej porównywać daty
      this.addCondition(task=>task.getDate() == filter.startDate);
    }
    if(filter.endDate != null){
      this.addCondition(task=>task.getEndDate() == filter.endDate);
    }
    if(filter.startTime != null){
      this.addCondition(task=>task.getStartTime() == filter.startTime);
    }
    if(filter.endDate != null){
      this.addCondition(task=>task.getEndTimer() == filter.endTime);
    }
  }

}
