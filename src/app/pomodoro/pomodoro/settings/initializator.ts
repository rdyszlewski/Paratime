import { PomodoroSettings, StateControl, SettingsAnswer } from './settings';
import { PomodoroSettingsStore } from './settings.storage';

export class SettingsInitializator{

  public static initializeSettings(): PomodoroSettings{
    const settings = new PomodoroSettings();
    settings.workTime = 25;
    settings.shortBreakTime = 5;
    settings.longBreakTime = 15;
    settings.interval = 3;
    settings.runNextState = StateControl.NO;
    settings.continueState = StateControl.WORK;
    settings.saveBreakStage = false;
    settings.saveStatistics = SettingsAnswer.YES;
    settings.saveStatisticsAfterStop = SettingsAnswer.YES;

    PomodoroSettingsStore.saveSettings(settings);
    return settings;
  }

}
