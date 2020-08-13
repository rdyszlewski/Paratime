import { Status } from './status';
import { OrderableItem } from './orderable.item';

export class Subtask extends OrderableItem {
  private name: string = null;
  private status: Status = null;
  private taskId: number = null;

  constructor(name = null, status = null) {
    super();
    this.name = name;
    this.status = status;
  }

  public getId() {
    return this.id;
  }

  public setId(id: number) {
    this.id = id;
  }

  public getName() {
    return this.name;
  }

  public setName(name: string) {
    this.name = name;
  }

  public getStatus() {
    return this.status;
  }

  public setStatus(status: Status) {
    this.status = status;
  }

  public getTaksId() {
    return this.taskId;
  }

  public setTaskId(id: number) {
    this.taskId = id;
  }

  public getContainerId(): number {
    return this.getTaksId();
  }
  public setContainerId(id: number): void {
    this.setTaskId(id);
  }
}
