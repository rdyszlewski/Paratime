import { PomodoroSettings } from './settings';

export class PomodoroSettingsStore{

    private static WORK_TIME = 'work_time';
    private static SHORT_BREAK = "short_break";
    private static LONG_BREAK = "long_break";
    private static INTERVAL = "interval";

    public static getSettings():PomodoroSettings{
        const settings = new PomodoroSettings();

        const workTime = localStorage.getItem(this.WORK_TIME);
        const shortBreak = localStorage.getItem(this.SHORT_BREAK);
        const longBreak = localStorage.getItem(this.LONG_BREAK);
        const interval = localStorage.getItem(this.INTERVAL);
        if(workTime && shortBreak && longBreak && interval){
            settings.workTime = Number.parseInt(workTime);
            settings.shortBreakTime = Number.parseInt(shortBreak);
            settings.longBreakTime = Number.parseInt(longBreak);
            settings.interval  = Number.parseInt(interval);
            return settings;
        }

        return null;
    }

    public static saveSettings(settings: PomodoroSettings){
        localStorage.setItem(this.WORK_TIME, settings.workTime.toString());
        localStorage.setItem(this.SHORT_BREAK, settings.shortBreakTime.toString());
        localStorage.setItem(this.LONG_BREAK, settings.longBreakTime.toString());
        localStorage.setItem(this.INTERVAL, settings.interval.toString());
    }

}
