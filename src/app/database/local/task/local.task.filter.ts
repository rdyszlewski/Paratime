import { Status } from 'app/database/shared/models/status';
import { Task } from 'app/database/shared/task/task';
import { TaskFilter } from 'app/database/shared/task/task.filter';
import { Position } from '../../shared/models/orderable.item';
import { RepositoryFilter } from '../pomodoro/local.repository-filter';

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
      this.addCondition(task=>{
        console.log("filter date");
        console.log(task["date"]);
        console.log(this.getDateFormat(filter.startDate));
        return task["date"] == this.getDateFormat(filter.startDate)}
        );
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
    if(filter.hasDate != null){
      this.addCondition(task=>(task["date"]!=null) == filter.hasDate)
    }
    if(filter.startRangeStartDate != null && filter.endRangeEndDate != null){
      this.addCondition(task=>{
        let startDate = this.getDateFormat(filter.startRangeStartDate);
        let endDate = this.getDateFormat(filter.endRangeEndDate);
        return task["date"]>= startDate
        && task["date"]<= endDate
      });
    }
    if(filter.status != null){
      this.addCondition(task=>task["status"]==filter.status);
    }

    if(filter.hasStartTime!=null){
      this.addCondition(task=>{
          console.log(task['startTime']);
          return (task["startTime"]!=null)==filter.hasStartTime}
        );
    }
    if(filter.first){
      this.addCondition(task=>task["position"] == Position.HEAD)
    }
    if(filter.last){
      this.addCondition(task=>task["successor"]==-1);
    }
  }

}
