import { DateAdapter } from 'app/database/shared/models/date.adapter';
import { Status } from 'app/database/shared/models/status';
import { TaskFilter } from 'app/database/shared/task/task.filter';
import { Position } from '../../shared/models/orderable.item';
import { RepositoryFilter } from '../pomodoro/local.repository-filter';
import { DexieTaskDTO } from './local.task';

export class TaskRepositoryFilter extends RepositoryFilter<DexieTaskDTO, TaskFilter>{

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
      // TODO: sprawdzić, czy to będzie w ten sposób
      this.addCondition(task=>task["important"]==1);
    }
    if(filter.startDate != null){
      // TODO: prawdopodobnie będzie trzeba inaczej porównywać daty
      this.addCondition(task=>{
        console.log("filter date");
        console.log(task["date"]);
        console.log(this.getDateFormat(filter.startDate));
        // TODO: sprawdzić, czy to będzie działało
        return task["date"] == DateAdapter.getText(filter.startDate);
        // return task["date"] == this.getDateFormat(filter.startDate);
      }
        );
    }
    if(filter.endDate != null){
      this.addCondition(task=>task["endDate"] == DateAdapter.getText(filter.endDate));
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
        let startDate = DateAdapter.getText(filter.startRangeStartDate);
        let endDate = DateAdapter.getText(filter.endRangeEndDate);
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
      this.addCondition(task=>task["_position"] == Position.HEAD)
    }
    if(filter.last){
      this.addCondition(task=>task["_successor"]==-1);
    }
  }

}
