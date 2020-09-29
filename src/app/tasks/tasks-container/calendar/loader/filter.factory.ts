import { DateOption, TaskStatus } from './calendar.settings';
import { IDateFilter, NoDateFilter, FutureDateFilter, PastDateFilter } from './date.filter';
import { ActiveStatusFilter, InactiveStatusFilter, IStatusFilter, NoStatusFilter } from './status.filter';

export class CalendarFilterFactoryResult{
  private _status: TaskStatus;
  private _dateFilter: IDateFilter;
  private _statusFilter: IStatusFilter;

  constructor(status: TaskStatus, dateFilter: IDateFilter, statusFilter: IStatusFilter){
    this._status = status;
    this._dateFilter = dateFilter;
    this._statusFilter = statusFilter;
  }

  public get status():TaskStatus{
    return this._status;
  }

  public get dateFilter(): IDateFilter{
    return this._dateFilter;
  }

  public get statusFilter():IStatusFilter{
    return this._statusFilter;
  }
}

export class CalendarFilterFactory{

  public static createStatusOption(status: TaskStatus){
    switch(status){
      case TaskStatus.ALL:
        return new NoStatusFilter();
      case TaskStatus.ACTIVE:
        return new ActiveStatusFilter();
      case TaskStatus.INACTIVE:
        return new InactiveStatusFilter();
    }
  }

  public static createDateOption(option: DateOption){
    switch(option){
      case DateOption.ALL:
        return new NoDateFilter();
      case DateOption.ACTIVE:
        return new FutureDateFilter();
      case DateOption.INACTIVE:
        return new PastDateFilter();
    }
  }
}
