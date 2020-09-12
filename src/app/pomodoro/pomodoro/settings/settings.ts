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
  private _runNextState: StateControl = StateControl.NO;
  /// determines, wheter after finish current state not change state, and countdown extra time
  private _continueState: StateControl = StateControl.NO;
  /// deterimens, wheter save timer result after stop current state
  ///
  private _saveSummary: SettingsAnswer = SettingsAnswer.YES;

  private _saveSummaryAfterStop: SettingsAnswer = SettingsAnswer.YES;

  private _saveBreaksSummary: boolean = true;

  private _saveStateLongerThan: number;

  private _allowAddingTime: boolean = true;


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

  public get saveBreaksSummary(): boolean {
    return this._saveBreaksSummary;
  }
  public set saveBreaksSummary(value: boolean) {
    this._saveBreaksSummary = value;
  }

  public get allowAddingTime(): boolean {
    return this._allowAddingTime;
  }
  public set allowAddingTime(value: boolean) {
    this._allowAddingTime = value;
  }

  public get saveSummary(): SettingsAnswer {
    return this._saveSummary;
  }
  public set saveSummary(value: SettingsAnswer) {
    this._saveSummary = value;
  }

  public get saveStateLongerThan(): number {
    return this._saveStateLongerThan;
  }
  public set saveStateLongerThan(value: number) {
    this._saveStateLongerThan = value;
  }

  public get saveSummaryAfterStop(): SettingsAnswer {
    return this._saveSummaryAfterStop;
  }
  public set saveSummaryAfterStop(value: SettingsAnswer) {
    this._saveSummaryAfterStop = value;
  }
}
