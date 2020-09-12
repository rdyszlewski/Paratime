import { PomodoroSettings, StateControl } from './settings';

export class PomodoroSettingsStore{

    private static WORK_TIME = 'work_time';
    private static SHORT_BREAK = "short_break";
    private static LONG_BREAK = "long_break";
    private static INTERVAL = "interval";
    private static RUN_NEXT_STATE ='run_next_state';
    private static CONTINUE_STATE = "continue_state";
    private static SAVE_SUMMARY = "save_summary";
    private static SAVE_SUMMARY_AFTER_STOP = "save_summary_after_stop";
    private static SAVE_BREAKS_SUMMARY = "save_breaks_summary";
    private static SAVE_STATE_LONGER_THAN = "save_summary_longer_than";
    private static ALLOW_ADDING_TIME = "allow_adding_time";

    public static getSettings():PomodoroSettings{
        const settings = new PomodoroSettings();

        const workTime = localStorage.getItem(this.WORK_TIME);
        const shortBreak = localStorage.getItem(this.SHORT_BREAK);
        const longBreak = localStorage.getItem(this.LONG_BREAK);
        const interval = localStorage.getItem(this.INTERVAL);
        const runNextState = localStorage.getItem(this.RUN_NEXT_STATE);
        const continueState = localStorage.getItem(this.CONTINUE_STATE);
        const saveSummary = localStorage.getItem(this.SAVE_SUMMARY);
        const saveSummaryAfterStop = localStorage.getItem(this.SAVE_SUMMARY_AFTER_STOP);
        const saveBreaksSummary = localStorage.getItem(this.SAVE_BREAKS_SUMMARY);
        const saveStateLongerThan = localStorage.getItem(this.SAVE_STATE_LONGER_THAN);
        const allowAddingTime = localStorage.getItem(this.ALLOW_ADDING_TIME);
        if(workTime && shortBreak && longBreak && interval){
            settings.workTime = Number.parseInt(workTime);
            settings.shortBreakTime = Number.parseInt(shortBreak);
            settings.longBreakTime = Number.parseInt(longBreak);
            settings.interval  = Number.parseInt(interval);
            settings.runNextState = Number.parseInt(runNextState);
            settings.continueState = Number.parseInt(continueState);
            settings.saveSummary = Number.parseInt(saveSummary);
            settings.saveSummaryAfterStop = Number.parseInt(saveSummaryAfterStop);
            settings.saveBreaksSummary = saveBreaksSummary == "true";
            settings.saveStateLongerThan = Number.parseInt(saveStateLongerThan);
            settings.allowAddingTime = allowAddingTime == "true";
            console.log(settings);
            return settings;
        }

        return null;
    }

    public static saveSettings(settings: PomodoroSettings){
        localStorage.setItem(this.WORK_TIME, settings.workTime.toString());
        localStorage.setItem(this.SHORT_BREAK, settings.shortBreakTime.toString());
        localStorage.setItem(this.LONG_BREAK, settings.longBreakTime.toString());
        localStorage.setItem(this.INTERVAL, settings.interval.toString());
        localStorage.setItem(this.RUN_NEXT_STATE, settings.runNextState.toString());
        localStorage.setItem(this.CONTINUE_STATE, settings.continueState.toString());
        localStorage.setItem(this.SAVE_SUMMARY, settings.saveSummary.toString());
        localStorage.setItem(this.SAVE_SUMMARY_AFTER_STOP, settings.saveSummaryAfterStop.toString());
        localStorage.setItem(this.SAVE_BREAKS_SUMMARY, settings.saveBreaksSummary? "true": "false");
        localStorage.setItem(this.SAVE_STATE_LONGER_THAN, settings.saveStateLongerThan.toString());
        localStorage.setItem(this.ALLOW_ADDING_TIME, settings.allowAddingTime? "true": "false");
    }

    public static removeSettings(){
      localStorage.removeItem(this.WORK_TIME);
      localStorage.removeItem(this.SHORT_BREAK);
      localStorage.removeItem(this.LONG_BREAK);
      localStorage.removeItem(this.INTERVAL);
      localStorage.removeItem(this.RUN_NEXT_STATE);
      localStorage.removeItem(this.CONTINUE_STATE);
      localStorage.removeItem(this.SAVE_SUMMARY);
      localStorage.removeItem(this.SAVE_SUMMARY_AFTER_STOP);
      localStorage.removeItem(this.SAVE_BREAKS_SUMMARY);
      localStorage.removeItem(this.SAVE_STATE_LONGER_THAN);
      localStorage.removeItem(this.ALLOW_ADDING_TIME);
    }

}
