import { DateAdapter } from "app/database/shared/models/date.adapter";
import { OrderableItem } from "app/database/shared/models/orderable.item";
import { Status } from "app/database/shared/models/status";
import { Project } from "app/database/shared/project/project";
import { Stage } from "app/database/shared/stage/stage";
import { Task } from "app/database/shared/task/task";
import { LocalDTO as DexieDTO } from "./local.dto";

export class DexieTaskDTO extends OrderableItem implements DexieDTO<Task> {

  public name: string;
  public description: string;
  public important: number;
  public date: string;
  public endDate: string;
  public startTime: number;
  public endTime: number;
  public plannedTime: number;
  public progress: number;
  public status: Status;
  public projectID: number;
  public stageID: number;
  public priority: number;

  constructor(task: Task) {
    super();
    this.update(task);
  }


  public getModel(): Task{
    let task = new Task();

    task.name = this.name;
    task.description = this.description;
    task.important = this.important == 1 ? true : false;
    task.date = DateAdapter.getDate(this.date);
    task.endDate = DateAdapter.getDate(this.endDate);
    task.plannedTime = this.plannedTime;
    task.progress = this.progress;
    task.status = this.status;;
    // TODO: tutaj powinno być pobieranie projektu chyba
    if(this.projectID >= 0){
      task.project = new Project();
      task.project.id = this.projectID;
    }
    if(this.stageID >= 0){
      task.projectStage = new Stage();
      task.projectStage.id = this.stageID;
    }
    task.priority = this.priority;

    return task;
  }

  public update(task: Task) {
    this.id = task.id;
    this.name = task.name;
    this.description = task.description;
    this.important = task.important ? 1 : 0;
    this.date = DateAdapter.getText(task.date);
    this.endDate = DateAdapter.getText(task.endDate);
    this.plannedTime = task.plannedTime;
    this.progress = task.progress;
    this.status = task.status;
    this.projectID = task.project ? task.project.id : -1;
    this.stageID = task.projectStage ? task.projectStage.id : -1;
    this.priority = task.priority;
  }

  public get containerId(): number {
    return this.projectID;
  }
  public set containerId(id: number) {
    this.projectID = id;
  }
}
