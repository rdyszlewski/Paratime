import { SettingsInitializator } from './initializator';
import { PomodoroSettings } from './settings';
import { PomodoroSettingsStore } from './settings.storage';

export class SettingsController{

  public static getSettings():PomodoroSettings{
    let settings = PomodoroSettingsStore.getSettings();
    if(!settings){
      settings = SettingsInitializator.initializeSettings();
    }
    return settings;
  }

  public static saveSettings(settings: PomodoroSettings){
    PomodoroSettingsStore.saveSettings(settings);
  }
}
