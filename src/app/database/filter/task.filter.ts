export class TaskFilter{
  private _projectId: number;
  private _active: boolean;
  private _finished: boolean;
  private _important: boolean;
  private _startDate: Date;
  private _endDate: Date;
  private _startTime: number;
  private _endTime: number;

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

  public static getBuilder(): TaskFilter.Builder{
    return new TaskFilter.Builder(new TaskFilter());
  }


  static Builder = class{

    constructor(private filter: TaskFilter){

    }

    public setProjectId(projectId: number): TaskFilter.Builder{
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

    public build(): TaskFilter{
      return this.filter;
    }
  }
}


export namespace TaskFilter {
  export type Builder = InstanceType<typeof TaskFilter.Builder>;
}
