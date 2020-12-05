import { Project } from 'app/database/shared/project/project';

type Callback = (IDialogModel)=>void;

export interface IDialogModel{
  name:string;
  project: Project;
  date: Date;
}

export class DialogModel implements IDialogModel{

  private _name: string;
  private _project: Project;
  private _date: Date;
  private _callback: Callback;

  constructor(name: string, project: Project, date: Date, callback: Callback){
    this._name = name;
    this._project = project;
    this._date = date;
    this._callback = callback;
  }

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }

  public get project(): Project {
    return this._project;
  }
  public set project(value: Project) {
    this._project = value;
  }

  public get date(): Date {
    return this._date;
  }
  public set date(value: Date) {
    this._date = value;
  }

  public get callback(): Callback {
    return this._callback;
  }
  public set callback(value: Callback) {
    this._callback = value;
  }
}
