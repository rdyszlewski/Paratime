
export enum TaskStatus{
  ACTIVE,
  INACTIVE,
  ALL
}

export enum DateOption{
  ACTIVE,
  INACTIVE,
  ALL,
}

export class CalendarSettings{
  private _taskStatus: TaskStatus = TaskStatus.ALL;
  private _dateOption: DateOption = DateOption.ALL;

  public get taskStatus(): TaskStatus {
    return this._taskStatus;
  }
  public set taskStatus(value: TaskStatus) {
    this._taskStatus = value;
  }

  public get dateOption(): DateOption {
    return this._dateOption;
  }
  public set dateOption(value: DateOption) {
    this._dateOption = value;
  }
}
