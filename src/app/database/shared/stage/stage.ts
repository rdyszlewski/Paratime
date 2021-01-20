import { Status } from '../models/status';
import { OrderableItem } from '../models/orderable.item';
import { Project } from '../project/project';

export class Stage extends OrderableItem {
  private _name: string;
  private _description: string;
  // TODO: sprawdzić, jak zostają zapisane daty w bazie danych
  private _startDate: Date;
  private _endDate: Date;
  private _status: Status;
  private _project: Project;
  private _projectID: number; // TODO: sprawdzić, czy to jest potrzebne i w jaki sposób można to zastąpić

  public get name(): string {
    return this._name;
  }

  public set name(value: string){
    this._name = value;
  }

  public get description(): string {
    return this._description;
  }

  public set description(value: string){
    this._description = value;
  }

  public get startDate(): Date{
    return this._startDate;
  }

  public set startDate(value: Date){
    this._startDate = value;
  }

  public get endDate(): Date {
    return this._endDate;
  }

  public set endDate(value: Date) {
    this._endDate = value;
  }

  public get status(): Status {
    return this._status;
  }

  public set status (value: Status){
    this._status = value;
  }

  public set project(value: Project) {
    this._project = value;
    // TODO: sprawdzić, czy to powinno być w ten sposób
    if (value) {
      this._projectID = value.id;
    }
  }

  public get projectID(): number {
    return this._projectID;
  }

  public set projectID(id: number) {
    this._projectID = id;
  }

  public get containerId(): number {
    return this._projectID;
  }
  public set containerId(value: number){
    this._projectID = value;
  }
}
