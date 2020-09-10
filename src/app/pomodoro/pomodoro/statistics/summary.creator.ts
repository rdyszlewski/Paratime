import { PomodoroStateSummary } from '../timer/summary';
import { IPomodoroTask } from '../model/task';
import { PomodoroSettings, SettingsAnswer } from '../settings/settings';
import { PomodoroSummary } from './summary';
import { State, BreakHelper } from '../timer/state';
import { ChangeStateCause } from '../timer/timer';

export class SummaryCreator{

  public static createPomodoroSummary(stateSummary: PomodoroStateSummary, task: IPomodoroTask, settings: PomodoroSettings, startDate: Date, finishDate: Date): PomodoroSummary{
    const summary = new PomodoroSummary(stateSummary.state, stateSummary.time);
    if(task){
      summary.taskId = task.getId();
      summary.projectId = task.getProjectId();
      summary.labelsIds = task.getLabels().map(label=>label.getId());
    }
    summary.startDate = startDate;
    summary.finishDate = finishDate;
    summary.saveSummary = this.isSaveStatistics(stateSummary.state, settings, stateSummary.finishCause);
    return summary;
  }

  private static isSaveStatistics(state: State ,settings: PomodoroSettings, cause: ChangeStateCause){
    // TODO: zrobić pytania
    if(settings.saveStatistics == SettingsAnswer.NO
      || cause == ChangeStateCause.SKIP
      || (cause == ChangeStateCause.STOP && !settings.saveStatisticsAfterStop)
      || ( BreakHelper.isBreak(state) && !settings.saveBreakStage )
    ){
      return false;
    }
    //
    return true;
  }



}
