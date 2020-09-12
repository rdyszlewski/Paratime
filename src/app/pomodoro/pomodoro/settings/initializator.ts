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
    settings.saveBreaksSummary = false;
    settings.saveSummary = SettingsAnswer.YES;
    settings.saveSummaryAfterStop = SettingsAnswer.YES;
    settings.saveStateLongerThan = 5;
    PomodoroSettingsStore.saveSettings(settings);
    return settings;
  }

}
