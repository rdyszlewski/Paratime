export enum StateControl{
  WORK,
  BREAK,
  ALL,
  NO
}

export enum SettingsAnswer{
  YES,
  NO,
  ASK
}

export class PomodoroSettings{

  /// time for work state in seconds
  private _workTime: number;
  /// time for short break state in seconds
  private _shortBreakTime: number;
  /// time for long break state in seconds
  private _longBreakTime: number;
  /// determines, how much work states will be before long break state
  private _interval: number;
  // TODO: tutaj może pojawić się konfilkt
  /// determines, whether after finish current state automatically run next state
  private _runNextState: StateControl;
  /// determines, wheter after finish current state not change state, and countdown extra time
  private _continueState: StateControl = StateControl.ALL;
  /// deterimens, wheter save timer result after stop current state
  private _saveBreakedStage: boolean;
  ///
  private _allowAddingTime: boolean;

  private _saveStatistics: SettingsAnswer;

  private _saveStatisticsAfterStop: SettingsAnswer;

  public get workTime(): number {
    return this._workTime;
  }
  public set workTime(value: number) {
    this._workTime = value;
  }

  public get shortBreakTime(): number {
    return this._shortBreakTime;
  }
  public set shortBreakTime(value: number) {
    this._shortBreakTime = value;
  }

  public get longBreakTime(): number {
    return this._longBreakTime;
  }
  public set longBreakTime(value: number) {
    this._longBreakTime = value;
  }

  public get interval(): number {
    return this._interval;
  }
  public set interval(value: number) {
    this._interval = value;
  }

  public get runNextState(): StateControl {
    return this._runNextState;
  }
  public set runNextState(value: StateControl) {
    this._runNextState = value;
  }

  public get continueState(): StateControl {
    return this._continueState;
  }
  public set continueState(value: StateControl) {
    this._continueState = value;
  }

  public get saveBreakedStage(): boolean {
    return this._saveBreakedStage;
  }
  public set saveBreakedStage(value: boolean) {
    this._saveBreakedStage = value;
  }

  public get allowAddingTime(): boolean {
    return this._allowAddingTime;
  }
  public set allowAddingTime(value: boolean) {
    this._allowAddingTime = value;
  }

  public get saveStatistics(): SettingsAnswer {
    return this._saveStatistics;
  }
  public set saveStatistics(value: SettingsAnswer) {
    this._saveStatistics = value;
  }

  public get saveStatisticsAfterStop(): SettingsAnswer {
    return this._saveStatisticsAfterStop;
  }
  public set saveStatisticsAfterStop(value: SettingsAnswer) {
    this._saveStatisticsAfterStop = value;
  }
}
