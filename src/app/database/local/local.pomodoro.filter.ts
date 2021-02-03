import { RepositoryFilter } from './pomodoro/local.repository-filter';
import { PomodoroFilter } from '../shared/pomodoro/pomodoro.filter';
import { DateAdapter } from '../shared/models/date.adapter';
import { DexiePomodoroHistoryDTO } from './pomodoro/local.pomodoro';

export class PomodoroRepositoryFilter extends RepositoryFilter<DexiePomodoroHistoryDTO, PomodoroFilter>{

  protected init(filter: PomodoroFilter) {
    if(filter.state!=null){
      this.addCondition(pomodoro=>pomodoro["state"]==filter.state);
    }
    if(filter.projectId!=null){
      this.addCondition(pomodoro=>pomodoro["projectId"]==filter.projectId);
    }
    if(filter.rangeStartDate != null && filter.rangeEndDate != null){
      let startDate = DateAdapter.getText(filter.rangeStartDate);
      let endDate = DateAdapter.getText(filter.rangeEndDate);
      this.addCondition(pomodoro=>pomodoro["startDate"]>=startDate
      && (pomodoro["startDate"]<=endDate)
      )};
    if(filter.date != null){
      let date = this.getDateFormat(filter.date);
      this.addCondition(pomodoro=>pomodoro["startDate"]==date);
    }
  }

}
