import { Status } from '../models/status';

export class TaskFilter{
  private _projectId: number = null;
  private _active: boolean = null;
  private _finished: boolean = null;
  private _important: boolean = null;
  private _startDate: Date = null;
  private _endDate: Date = null;
  private _startTime: number = null;
  private _endTime: number = null;
  private _hasDate: boolean = null;
  private _startRangeStartDate: Date = null;
  private _endRangeStartDate: Date = null;
  private _status: Status = null;
  private _hasStartTime: boolean = null;
  private _first: boolean = null;
  private _last: boolean = null;

  private constructor(){}

  public get projectId(): number {
    return this._projectId;
  }

  public get active(): boolean{
    return this._active;
  }

  public get finished():boolean{
    return this._finished;
  }

  public get important(): boolean{
    return this._important;
  }

  public get startDate():Date{
    return this._startDate;
  }

  public get endDate():Date{
    return this._endDate;
  }

  public get startTime(): number{
    return this._startTime;
  }

  public get endTime(): number{
    return this._endTime;
  }

  public get hasDate(): boolean{
    return this._hasDate;
  }

  // TODO: trochę lepiej zaplanować jak te filtry mają działać
  public get startRangeStartDate():Date{
    return this._startRangeStartDate;
  }

  public get endRangeEndDate(): Date{
    return this._endRangeStartDate;
  }

  public get status(): Status{
    return this._status;
  }

  public get hasStartTime(): boolean{
    return this._hasStartTime;
  }

  public get first(): boolean{
    return this._first;
  }

  public get last(): boolean{
    return this._last;
  }

  public static getBuilder(): TaskFilter.Builder{
    return new TaskFilter.Builder(new TaskFilter());
  }

  static Builder = class{

    constructor(private filter: TaskFilter){

    }

    public setProject(projectId: number): TaskFilter.Builder{
      this.filter._projectId = projectId;
      return this;
    }

    public setActive(active: boolean): TaskFilter.Builder{
      this.filter._active = active;
      return this;
    }

    public setFinished(finished: boolean): TaskFilter.Builder{
      this.filter._finished = finished;
      return this;
    }

    public setImportant(important: boolean): TaskFilter.Builder{
      this.filter._important = important;
      return this;
    }

    public setStartDate(date: Date): TaskFilter.Builder{
      this.filter._startDate = date;
      return this;
    }

    public setEndDate(date: Date): TaskFilter.Builder{
      this.filter._endDate = date;
      return this;
    }

    public setStartTime(time: number): TaskFilter.Builder{
      this.filter._startTime = time;
      return this;
    }

    public setEndTime(time: number): TaskFilter.Builder{
      this.filter._endTime = time;
      return this;
    }

    public setHasDate(hasDate: boolean): TaskFilter.Builder{
      this.filter._hasDate = hasDate;
      return this;
    }

    public setStartDateRange(start: Date, end: Date): TaskFilter.Builder{
      this.filter._startRangeStartDate = start;
      this.filter._endRangeStartDate = end;
      return this;
    }

    public setStatus(status: Status): TaskFilter.Builder{
      this.filter._status = status;
      return this;
    }

    public setHasStartTime(hasTime: boolean): TaskFilter.Builder{
      this.filter._hasStartTime = hasTime;
      return this;
    }

    public setFirst(first: boolean): TaskFilter.Builder{
      this.filter._first = first;
      return this;
    }

    public setLast(last: boolean): TaskFilter.Builder{
      this.filter._last = last;
      return this;
    }

    public build(): TaskFilter{
      return this.filter;
    }
  }
}


export namespace TaskFilter {
  export type Builder = InstanceType<typeof TaskFilter.Builder>;
}
