import { DateAdapter } from "app/database/shared/models/date.adapter";
import { OrderableItem } from "app/database/shared/models/orderable.item";
import { Status } from "app/database/shared/models/status";
import { Project } from "app/database/shared/project/project";
import { ProjectType } from "app/database/shared/project/project_type";
import { LocalDTO } from "../task/local.dto";

export class DexieProjectDTO extends OrderableItem implements LocalDTO<Project> {

  public name: string;
  public description: string;
  public startDate: string;
  public endDate: string;
  public status: Status = Status.STARTED;
  public type: ProjectType;

  constructor(project: Project){
    super();
    this.update(project);
  }


  public getModel(): Project {
    let model = new Project();
    model.id = this._id;
    model.name = this.name;
    model.description = this.description;
    model.startDate = DateAdapter.getDate(this.startDate);
    model.endDate = DateAdapter.getDate(this.endDate);
    model.status = this.status;
    model.type = this.type;
    return model;
  }

  public update(project: Project) {
    this.id = project.id;
    this.name = project.name;
    this.description = project.description;
    this.startDate = DateAdapter.getText(project.startDate);
    this.endDate = DateAdapter.getText(project.endDate);
    this.status = project.status;
    this.type = project.type;
  }

  public get containerId(): number {
    return null;
  }

  public set containerId(id: number) {

  }
}
