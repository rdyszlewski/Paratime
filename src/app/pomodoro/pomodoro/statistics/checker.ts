import { State, BreakHelper } from '../timer/state';
import { PomodoroSettings, SettingsAnswer } from '../settings/settings';
import { ChangeStateCause } from '../timer/timer';

export enum Answer{
  YES,
  NO,
  ASK
}

export class SaveStatisticsChecker{

  public  static isSaveStatistics(state: State ,settings: PomodoroSettings, cause: ChangeStateCause):Answer{
    // TODO: zrobić pytania
    if(settings.saveSummary == SettingsAnswer.ASK){
      return Answer.ASK;
    }
    if(settings.saveSummary == SettingsAnswer.NO
      || cause == ChangeStateCause.SKIP
      || (cause == ChangeStateCause.STOP && !settings.saveSummaryAfterStop)
      || ( BreakHelper.isBreak(state) && !settings.saveBreaksSummary )
    ){
      return Answer.NO;
    }
    //
    return Answer.ASK;
  }
}
