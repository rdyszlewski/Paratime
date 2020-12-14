import { Status } from '../models/status';

export class StageFilter{

  private _name: string;
  private _projectId: number;
  private _startDate: Date;
  private _endDate: Date;
  private _status: Status;

  private constructor(){}

  public static getBuilder():StageFilter.Builder{
    return new StageFilter.Builder(new StageFilter());
  }

  public get name(): string{
    return this._name;
  }

  public get projectId(): number{
    return this._projectId;
  }

  public get startDate(): Date{
    return this._startDate;
  }

  public get endDate(): Date{
    return this._endDate;
  }

  public get status(): Status{
    return this._status;
  }

  static Builder = class{

    constructor(private filter: StageFilter){}

    public setName(name: string): StageFilter.Builder{
      this.filter._name = name;
      return this;
    }

    public setProjectId(projectId: number): StageFilter.Builder{
      this.filter._projectId = projectId;
      return this;
    }

    public setStartDate(startDate: Date): StageFilter.Builder{
      this.filter._startDate = startDate;
      return this;
    }

    public setEndDate(endDate: Date): StageFilter.Builder{
      this.filter._endDate = endDate;
      return this;
    }

    public setStatus(status: Status): StageFilter.Builder{
      this.filter._status = status;
      return this;
    }

    public build(): StageFilter{
      return this.filter;
    }
  }
}

export namespace StageFilter {
  export type Builder = InstanceType<typeof StageFilter.Builder>;
}
