import { DateAdapter } from "app/database/shared/models/date.adapter";
import { OrderableItem } from "app/database/shared/models/orderable.item";
import { Status } from "app/database/shared/models/status";
import { Project } from "app/database/shared/project/project";
import { Stage } from "app/database/shared/stage/stage";
import { LocalDTO } from "../task/local.dto";

export class DexieStageDTO extends OrderableItem implements LocalDTO<Stage>{

  public name: string;
  public description: string;
  public startDate: string;
  public endDate: string;
  public status: Status;
  public projectId: number;

  constructor(stage: Stage){
    super();

    this.id = stage.id;
    this.name = stage.name;
    this.description = stage.description;
    this.startDate = DateAdapter.getText(stage.startDate);
    this.endDate = DateAdapter.getText(stage.endDate);
    this.status = stage.status;
    this.projectId = stage.project != null ? stage.project.id : -1;
  }

  public getModel(): Stage{
    let stage = new Stage();
    stage.id = this.id;
    stage.name = this.name;
    stage.description = this.description;
    stage.startDate = DateAdapter.getDate(this.startDate);
    stage.endDate = DateAdapter.getDate(this.endDate);
    stage.status = this.status;
    // TODO: w przypadku problemów dodać pobieranie projektu z bazy danych
    stage.project = new Project();
    stage.project.id = this.projectId;
    return stage;
  }

  public get containerId(): number {
    return this.projectId;
  }
  public set containerId(id: number) {
    this.projectId = id;
  }

}
