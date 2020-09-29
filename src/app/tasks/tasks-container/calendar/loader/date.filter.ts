import { Task } from 'app/database/data/models/task';

export interface IDateFilter{
  isCorrect(task: Task): boolean;
}

export class NoDateFilter implements IDateFilter{

  public isCorrect(task: Task) {
    return true;
  }
}

export class FutureDateFilter implements IDateFilter{

  private _currentDate;

  constructor(){
    this._currentDate = new Date();
  }

  public isCorrect(task: Task): boolean {
    return task.getDate() >= this._currentDate;
  }
}

export class PastDateFilter implements IDateFilter{

  private _currentDate;

  constructor(){
    this._currentDate = new Date();
  }

  isCorrect(task: Task): boolean {
    return task.getDate() < this._currentDate;
  }
}
