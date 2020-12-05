import { State } from 'app/pomodoro/pomodoro/shared/state';

export class PomodoroFilter{

  private _state: State;
  private _projectId: number;
  private _rangeStartDate: Date;
  private _rangeEndDate: Date;
  private _date: Date;

  public get state(): State{
    return this._state;
  }

  public get projectId(): number{
    return this._projectId;
  }

  public get rangeStartDate(): Date{
    return this._rangeStartDate;
  }

  public get rangeEndDate():Date{
    return this._rangeEndDate;
  }

  public get date():Date{
    return this._date;
  }

  private constructor(){
  }

  public getBuilder(): PomodoroFilter.Builder{
    return new PomodoroFilter.Builder(new PomodoroFilter());
  }

  static Builder = class{

    constructor(private filter: PomodoroFilter){}

    public setState(state: State):PomodoroFilter.Builder{
      this.filter._state = state;
      return this;
    }

    public setProject(projectId: number): PomodoroFilter.Builder{
      this.filter._projectId = projectId;
      return this;
    }

    public setDateRange(startDate: Date, endDate: Date): PomodoroFilter.Builder{
      this.filter._rangeStartDate = startDate;
      this.filter._rangeEndDate = endDate;
      return this;
    }

    public setDate(date: Date): PomodoroFilter.Builder{
      this.filter._date = date;
      return this;
    }

    public build():PomodoroFilter{
      return this.filter;
    }
  }
}

export namespace PomodoroFilter {
  export type Builder = InstanceType<typeof PomodoroFilter.Builder>;
}
