import { DateAdapter } from "app/database/shared/models/date.adapter";
import { OrderableItem } from "app/database/shared/models/orderable.item";
import { Status } from "app/database/shared/models/status";
import { Project } from "app/database/shared/project/project";
import { ProjectType } from "app/database/shared/project/project_type";
import { LocalDTO } from "../task/local.dto";

export class DexieProjectDTO extends OrderableItem implements LocalDTO<Project> {

  private _name: string;
  private _description: string;
  private _startDate: string;
  private _endDate: string;
  private _status: Status;
  private _type: ProjectType;

  constructor(project: Project){
    super();
    this._id = project.id;
    this._name = project.name;
    this._description = project.description;
    this._startDate = DateAdapter.getText(project.startDate);
    this._endDate = DateAdapter.getText(project.endDate);
    this._status = project.status;
    this._type = project.type;
  }

  public getModel(): Project {
    let model = new Project();
    model.id = this._id;
    model.name = this._name;
    model.description = this._description;
    model.startDate = DateAdapter.getDate(this._startDate);
    model.endDate = DateAdapter.getDate(this._endDate);
    model.status = this._status;
    model.type = this._type;
    return model;
  }

	public get name(): string {
		return this._name;
	}

	public get description(): string {
		return this._description;
	}


	public get startDate(): string {
		return this._startDate;
	}

    /**
     * Getter endDate
     * @return {string}
     */
	public get endDate(): string {
		return this._endDate;
	}

    /**
     * Getter status
     * @return {Status}
     */
	public get status(): Status {
		return this._status;
	}

    /**
     * Getter type
     * @return {ProjectType}
     */
	public get type(): ProjectType {
		return this._type;
	}

    /**
     * Setter name
     * @param {string} value
     */
	public set name(value: string) {
		this._name = value;
	}

    /**
     * Setter description
     * @param {string} value
     */
	public set description(value: string) {
		this._description = value;
	}

    /**
     * Setter startDate
     * @param {string} value
     */
	public set startDate(value: string) {
		this._startDate = value;
	}

    /**
     * Setter endDate
     * @param {string} value
     */
	public set endDate(value: string) {
		this._endDate = value;
	}

    /**
     * Setter status
     * @param {Status} value
     */
	public set status(value: Status) {
		this._status = value;
	}

    /**
     * Setter type
     * @param {ProjectType} value
     */
	public set type(value: ProjectType) {
		this._type = value;
	}

  public get containerId(): number {
    return null;
  }

  public set containerId(id: number) {

  }
}
