import { OrderableItem } from '../models/orderable.item';
import { Status } from '../models/status';


export class Subtask extends OrderableItem {
  private _name: string = null;
  private _status: Status = null;
  private _taskId: number = null;

  constructor(name = null, status = null) {
    super();
    this._name = name;
    this._status = status;
  }

  public get id() {
    return this._id;
  }

  public set id(value: number) {
    this._id = value;
  }

  public get name() {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get status() {
    return this._status;
  }

  public set status(value: Status) {
    this._status = value;
  }

  public get taskId() {
    return this._taskId;
  }

  public set taskId(value: number) {
    this._taskId = value;
  }

  public get containerId(): number {
    return this._taskId;
  }
  public set containerId(value: number){
    this._taskId = value;
  }
}
