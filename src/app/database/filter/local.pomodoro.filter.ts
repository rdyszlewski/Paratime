import { PomodoroHistory } from '../data/models/pomodoro.history';
import { RepositoryFilter } from './local.repository-filter';
import { PomodoroFilter } from './pomodoro.filter';

export class PomodoroRepositoryFilter extends RepositoryFilter<PomodoroHistory, PomodoroFilter>{

  protected init(filter: PomodoroFilter) {
    if(filter.state!=null){
      this.addCondition(pomodoro=>pomodoro["state"]==filter.state);
    }
    if(filter.projectId!=null){
      this.addCondition(pomodoro=>pomodoro["projectId"]==filter.projectId);
    }
    if(filter.rangeStartDate != null && filter.rangeEndDate != null){
      let startDate = this.getDateFormat(filter.rangeStartDate);
      let endDate = this.getDateFormat(filter.rangeEndDate);
      this.addCondition(pomodoro=>this.getDateFormat(pomodoro["startDate"])>=startDate
      && this.getDateFormat(pomodoro["startDate"])<=endDate);
    }
    if(filter.date != null){
      let date = this.getDateFormat(filter.date);
      this.addCondition(pomodoro=>this.getDateFormat(pomodoro["startDate"])==date);
    }
  }

}
