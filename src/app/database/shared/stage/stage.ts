import { Status } from '../models/status';
import { OrderableItem } from '../models/orderable.item';
import { Project } from '../project/project';

export class Stage extends OrderableItem {
  private name: string;
  private description: string;
  private startDate: Date;
  private endDate: Date;
  private status: Status;
  private project: Project;
  private projectID: number;

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getDescription(): string {
    return this.description;
  }

  public setDescription(description: string): void {
    this.description = description;
  }

  public getStartDate(): Date{
    return this.startDate;
  }

  public setStartDate(date: Date){
    this.startDate = date;
  }

  public getEndDate(): Date {
    return this.endDate;
  }

  public setEndDate(date: Date) {
    this.endDate = date;
  }

  public getStatus(): Status {
    return this.status;
  }

  public setStatus(status: Status): void {
    this.status = status;
  }

  public setProject(project: Project): void {
    this.project = project;
    if (project) {
      this.projectID = project.getId();
    }
  }

  public getProjectID(): number {
    return this.projectID;
  }

  public setProjectID(id: number) {
    this.projectID = id;
  }

  public getContainerId(): number {
    return this.getProjectID();
  }
  public setContainerId(id: number): void {
    this.setProjectID(id);
  }
}
