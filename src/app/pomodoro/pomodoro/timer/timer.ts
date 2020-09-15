import { State, TimerState} from '../shared/state';
import { PomodoroSettings as PomodoroSettings,} from '../settings/settings';
import { PomodoroStateSummary } from './summary';

export type TimerTickCallback = (time: number)=>void;
export type TimerEndCallback = (summary: PomodoroStateSummary)=>void;

export interface ITimerControl{
  start();
  stop();
  pause();
  resume(); // TODO: co ja tutaj miałem na myśli
  continueState();
  skipState();
  addTime(time: number);
}

export interface ITimerCallbacks{
  setTickCallback(callback: TimerTickCallback);
  setEndCallback(callback: TimerEndCallback);
}

export interface ITimerInfo{
  isTicking(): boolean;
  currentStep():number;
  currentState():State;
  timerState(): TimerState;
  time(): number;
}

export interface IPomodoroTimer extends ITimerControl, ITimerCallbacks, ITimerInfo{
  updateSettings(settings: PomodoroSettings);
  getSummary(): PomodoroStateSummary;
  resetStateTime():void;
}
