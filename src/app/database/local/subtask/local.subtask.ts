import { OrderableItem } from "app/database/shared/models/orderable.item";
import { Status } from "app/database/shared/models/status";
import { Subtask } from "app/database/shared/subtask/subtask";
import { LocalDTO } from "../task/local.dto";

export class DexieSubtaskDTO extends OrderableItem implements LocalDTO<Subtask>{
  public name: string;
  public status: Status;
  public taskId: number;

  constructor(subtask: Subtask) {
    super();
    this.update(subtask);
  }

  public getModel(): Subtask {
    let subtask = new Subtask();
    subtask.id = this.id;
    subtask.name = this.name;
    subtask.status = this.status;
    subtask.taskId = this.taskId;
    return subtask;
  }

  public update(subtask: Subtask) {
    this.id = subtask.id;
    this.name = subtask.name;
    this.status = subtask.status;
    this.taskId = subtask.taskId;
  }

  public get containerId(): number {
    return this.taskId;
  }
  public set containerId(id: number) {
    this.taskId = id;
  }
}
