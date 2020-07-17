import { PomodoroSetting } from '../settings';

export class PomodoroSettingsStore{

    private static WORK_TIME = 'work_time';
    private static SHORT_BREAK = "short_break";
    private static LONG_BREAK = "long_break";
    private static INTERVAL = "interval";

    public static getSettings():PomodoroSetting{
        const settings = new PomodoroSetting();

        const workTime = localStorage.getItem(this.WORK_TIME);
        const shortBreak = localStorage.getItem(this.SHORT_BREAK);
        const longBreak = localStorage.getItem(this.LONG_BREAK);
        const interval = localStorage.getItem(this.INTERVAL);
        if(workTime && shortBreak && longBreak && interval){
            settings.setWorkTime(Number.parseInt(workTime));
            settings.setShortBreakTime(Number.parseInt(shortBreak));
            settings.setLongBreakTime(Number.parseInt(longBreak));
            settings.setInterval(Number.parseInt(interval));
            return settings;
        }

        return null;
    }

    public static saveSettings(settings: PomodoroSetting){
        localStorage.setItem(this.WORK_TIME, settings.getWorkTime().toString());
        localStorage.setItem(this.SHORT_BREAK, settings.getShortBreakTime().toString());
        localStorage.setItem(this.LONG_BREAK, settings.getLongBreakTime().toString());
        localStorage.setItem(this.INTERVAL, settings.getInterval().toString());
    }

}