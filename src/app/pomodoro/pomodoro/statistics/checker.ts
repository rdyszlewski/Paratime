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
    if(settings.saveStatistics == SettingsAnswer.ASK){
      return Answer.ASK;
    }
    if(settings.saveStatistics == SettingsAnswer.NO
      || cause == ChangeStateCause.SKIP
      || (cause == ChangeStateCause.STOP && !settings.saveStatisticsAfterStop)
      || ( BreakHelper.isBreak(state) && !settings.saveBreakStage )
    ){
      return Answer.NO;
    }
    //
    return Answer.ASK;
  }
}
