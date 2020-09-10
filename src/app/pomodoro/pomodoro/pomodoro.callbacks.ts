import { PomodoroSummary } from './statistics/summary';

export type PomodoroTickCallback = (time: string)=>void;
export type PomodoroEndCallback = (summary: PomodoroSummary)=>void;
export type SaveSummaryCallback = (summary: PomodoroSummary)=>void;

export interface IPomodoroCallbacks{
  addTickCallback(name: string, callback: PomodoroTickCallback);
  removeTickCallback(name: string);
  addEndCallback(name:string, callback: PomodoroEndCallback);
  removeEndCallback(name: string);
  setSaveSummaryCallback(callback: SaveSummaryCallback);
}
