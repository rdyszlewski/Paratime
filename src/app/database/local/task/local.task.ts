import { DateAdapter } from "app/database/shared/models/date.adapter";
import { OrderableItem } from "app/database/shared/models/orderable.item";
import { Status } from "app/database/shared/models/status";
import { Project } from "app/database/shared/project/project";
import { Stage } from "app/database/shared/stage/stage";
import { Task } from "app/database/shared/task/task";
import { LocalDTO as DexieDTO } from "./local.dto";

export class DexieTaskDTO extends OrderableItem implements DexieDTO<Task> {


  private _name: string = null;
  private _description: string = null;
  private _important: number = 0;
  private _date: string;
  private _endDate: string;
  private _startTime: number;
  private _endTime: number;
  private _plannedTime: number;
  private _progress: number;
  private _status: Status;
  private _projectID: number;
  private _stageID: number;
  private _priority: number;

  constructor(task: Task) {
    super();
    this._name = task.name;
    this._description = task.description;
    this._important = task.important ? 1 : 0;
    this._date = DateAdapter.getText(task.date);
    this._endDate = DateAdapter.getText(task.endDate);
    this._plannedTime = task.plannedTime;
    this._progress = task.progress;
    this._status = task.status;
    this._projectID = task.project ? task.project.id : -1;
    this._stageID = task.projectStage ? task.projectStage.id : -1;
    this._priority = task.priority;
  }

  public getModel(): Task{
    let task = new Task();

    task.name = this._name;
    task.description = this._description;
    task.important = this._important == 1 ? true : false;
    task.date = DateAdapter.getDate(this._date);
    task.endDate = DateAdapter.getDate(this._endDate);
    task.plannedTime = this._plannedTime;
    task.progress = this._progress;
    task.status = this._status;;
    // TODO: tutaj powinno być pobieranie projektu chyba
    if(this._projectID >= 0){
      task.project = new Project();
      task.project.id = this._projectID;
    }
    if(this._stageID >= 0){
      task.projectStage = new Stage();
      task.projectStage.id = this._stageID;
    }
    task.priority = this._priority;

    return task;
  }

	public get name(): string  {
    return this._name;
	}

	public get description(): string  {
    return this._description;
	}

	public get important(): number  {
    return this._important;
	}

	public get date(): string {
    return this._date;
	}

	public get endDate(): string {
    return this._endDate;
	}

	public get startTime(): number {
    return this._startTime;
	}

	public get endTime(): number {
    return this._endTime;
	}

	public get plannedTime(): number {
    return this._plannedTime;
	}

	public get progress(): number {
    return this._progress;
	}

	public get status(): Status {
    return this._status;
	}

	public get projectID(): number {
    return this._projectID;
	}

	public get stageID(): number {
    return this._stageID;
	}

	public get priority(): number {
    return this._priority;
	}

	public set name(value: string ) {
    this._name = value;
	}

	public set description(value: string ) {
    this._description = value;
	}

	public set important(value: number ) {
    this._important = value;
	}

	public set date(value: string) {
    this._date = value;
	}

	public set endDate(value: string) {
    this._endDate = value;
	}

	public set startTime(value: number) {
    this._startTime = value;
	}

	public set endTime(value: number) {
    this._endTime = value;
	}

	public set plannedTime(value: number) {
    this._plannedTime = value;
	}

	public set progress(value: number) {
    this._progress = value;
	}

	public set status(value: Status) {
    this._status = value;
	}

	public set projectID(value: number) {
    this._projectID = value;
	}

	public set stageID(value: number) {
    this._stageID = value;
	}

	public set priority(value: number) {
    this._priority = value;
	}

  public get containerId(): number {
    return this._projectID;
  }
  public set containerId(id: number) {
    this._projectID = id;
  }
}
