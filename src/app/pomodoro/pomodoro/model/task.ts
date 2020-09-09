import { IPomodoroLabels as IPomodoroLabel, PomodoroLabel } from './label';

export interface IPomodoroTask{
  getId(): number;
  getName(): string;
  getProjectId(): number;
  getProjectName(): string;
  getLabels():IPomodoroLabel[];
  setTask(id: number, name: string): void;
  setProject(id: number, name: string): void;
  addLabel(id: number, name: string): void;
}

export class Pomodorotask implements IPomodoroTask{

  private _id: number;
  private _name: string;
  private _projectId: number;
  private _projectName: string;
  private _labels: IPomodoroLabel[];

  constructor(){
    this._labels = [];
  }

  public getId(): number {
    return this._id;
  }

  public getName(): string {
    return this._name;
  }

  public getProjectId(): number {
    return this._projectId;
  }

  public getProjectName(): string {
    return this._projectName;
  }

  public getLabels(): IPomodoroLabel[] {
    return this._labels;
  }

  public setTask(id: number, name: string): void {
    this._id = id;
    this._name = name;
  }

  public setProject(id: number, name: string): void {
    this._projectId = id;
    this._projectName = name;
  }

  public addLabel(id: number, name: string): void {
    this._labels.push(new PomodoroLabel(id, name));
  }

}
