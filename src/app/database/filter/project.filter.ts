import { TransitionCheckState } from '@angular/material/checkbox';

export class ProjectFilter{
  private _finished: boolean;
  private _startDate: Date;
  private _endDate: Date;
  private _description: string;

  private constructor(){}

  public get finished():boolean{
    return this._finished;
  }

  public get startDate(): Date{
    return this._startDate;
  }

  public get endDate(): Date{
    return this._endDate;
  }

  public get description(): string{
    return this._description;
  }

  public static getBuilder(): ProjectFilter.Builder{
    return new ProjectFilter.Builder(new ProjectFilter());
  }

  static Builder = class{

    constructor(private filter: ProjectFilter){}

    public setFinished(finished: boolean): ProjectFilter.Builder{
      this.filter._finished = finished;
      return this;
    }

    public setStartDate(date: Date): ProjectFilter.Builder{
      this.filter._startDate = date;
      return this;
    }

    public setEndDate(date: Date): ProjectFilter.Builder{
      this.filter._endDate = date;
      return this;
    }

    public setDescription(description: string): ProjectFilter.Builder{
      this.filter._description = description;
      return this;
    }

    public build(): ProjectFilter{
      return this.filter;
    }
  }
}

export namespace ProjectFilter {
  export type Builder = InstanceType<typeof ProjectFilter.Builder>;
}
