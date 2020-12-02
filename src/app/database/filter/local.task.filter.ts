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
      this.addCondition(task=>task["projectID"]== filter.projectId);
    }
    if(filter.active){
      this.addCondition(task=>task["status"]==Status.STARTED);
    }
    if(filter.finished){
      this.addCondition(task=>task["status"]==Status.ENDED);
    }
    if(filter.important){
      // TODO: sprawdzić, czy jest poprawnie
      this.addCondition(task=>task["important"]==1);
    }
    if(filter.startDate != null){
      // TODO: prawdopodobnie będzie trzeba inaczej porównywać daty
      this.addCondition(task=>task["date"] == filter.startDate.toString());
    }
    if(filter.endDate != null){
      this.addCondition(task=>task["endDate"] == filter.endDate.toString());
    }
    if(filter.startTime != null){
      this.addCondition(task=>task["startTime"] == filter.startTime);
    }
    if(filter.endDate != null){
      this.addCondition(task=>task["endTime"] == filter.endTime);
    }
  }
}
