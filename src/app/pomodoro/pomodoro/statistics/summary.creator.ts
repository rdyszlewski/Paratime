import { PomodoroStateSummary } from '../timer/summary';
import { IPomodoroTask } from '../model/task';
import { PomodoroSettings} from '../settings/settings';
import { PomodoroSummary } from './summary';

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
    return summary;
  }

}
