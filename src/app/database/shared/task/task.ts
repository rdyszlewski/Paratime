import { Label } from "../label/label";
import { Priority } from "./priority";
import { Stage } from "../stage/stage";
import { OrderableItem } from "../models/orderable.item";
import { ITaskItem } from "./task.item";
import { IFilterable } from "app/shared/common/filter/filterable";
import { Status } from "../models/status";
import { Project } from "../project/project";
import { Subtask } from "../subtask/subtask";

export class Task extends OrderableItem implements IFilterable, ITaskItem {
  // TODO: przejrzeć wszystkie zmienne i zobaczyć, czy wszystko jest ok

  private _name: string = null;
  private _description: string = null;
  private _important: number = 0;
  private _labels: Label[] = [];
  // private date: string = null; // TODO: wstawić to do modelu zapisywanego w bazie dexie
  private _date: Date = null;
  // tasks start time (format HHMM) H * 100 + M
  private _startTime: number = null;
  private _endTime: number = null;
  // private endDate: string = null;
  private _endDate: Date = null;
  private _plannedTime: number = null;
  private _subtasks: Subtask[] = [];
  private _status: Status = Status.STARTED;
  private _progress: number = null;
  private _project: Project = null;
  private _projectID: number; // TODO: to może być tylko w bazie. Sprawdzić to
  private _priority: Priority = null;
  private _projectStage: Stage = null;
  private _projectStageID: number = null; // TODO: sprawdzić, czy nie da się poradzić bez tego

  constructor(name = null, description = null, status = null) {
    super();
    this._name = name;
    this._description = description;
    this._status = status;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get description() {
    return this._description;
  }

  public set description(description: string) {
    this._description = description;
  }

  public get important(): boolean {
    return this._important == 1;
  }

  public set important(important: boolean) {
    this._important = important ? 1 : 0;
  }

  public get labels() {
    return this._labels;
  }

  public addLabel(label: Label) {
    if (!this._labels.includes(label)) {
      this._labels.push(label);
    }
  }

  public removeLabel(label: Label) {
    const index = this._labels.indexOf(label);
    if (index >= 0) {
      this._labels.splice(index, 1);
    }
  }

  public set labels(labels: Label[]) {
    this._labels = labels;
  }

  public get date(): Date {
    return this._date;
  }

  public set date(date: Date){
    this._date = date;
  }

  public get startTime(): number {
    return this._startTime;
  }

  public set startTime(time: number){
    this._startTime = time;
  }

  public get endTime(): number {
    return this._endTime;
  }

  public set endTime(time: number) {
    this._endTime = time;
  }

  public get endDate(): Date {
    return this._endDate;
  }

  public set endDate(date: Date) {
    this._endDate = date;
  }

  public get plannedTime() {
    return this._plannedTime;
  }

  public set plannedTime(time: number) {
    this._plannedTime = time;
  }

  public get subtasks() {
    return this._subtasks;
  }

  public set subtasks(subtasks: Subtask[]) {
    if(subtasks == null){
      this._subtasks = [];
    } else {
      this._subtasks = subtasks;
    }
  }

  public addSubtask(subtask: Subtask) {
    this._subtasks.push(subtask);
  }

  public removeSubtask(subtask: Subtask) {
    const index = this._subtasks.indexOf(subtask);
    if (index >= 0) {
      this._subtasks.splice(index, 1);
    }
  }

  public get status() {
    return this._status;
  }

  public set status(value: Status) {
    this._status = value;
  }

  public get progress() {
    return this._progress;
  }

  public set progress(value: number) {
    this._progress = value;
  }

  public get project() {
    return this._project;
  }

  public set project(value: Project) {
    this._project = value;
  }

  public get projectID() {
    return this._projectID;
  }

  public set projectID(value: number) {
    this._projectID = value;
  }

  public getNumberOfSubtaskWithStatus(status: Status) {
    let finishedSubtask = this._subtasks.filter((x) => x.status == status);
    return finishedSubtask.length;
  }

  public get priority(): Priority {
    return this._priority;
  }

  public set priority(priority: Priority) {
    this._priority = priority;
  }

  public get projectStage(): Stage {
    return this._projectStage;
  }

  public set projectStage(projectStage: Stage) {
    this._projectStage = projectStage;
    if (this._projectStage) {
      this._projectStageID = this._projectStage.id;
    }
  }

  public get projectStageID(): number {
    return this._projectStageID;
  }

  public set projectStageID(id: number) {
    this._projectStageID = id;
  }

  public get containerId(): number {
    return this._projectID;
  }

  public set containerId(id: number){
    // TODO: sprawdzić, czy tak to powinno być. Czy coś się przypadkiem nie zepsuje, jeśli będziemy zapisywać wyłącznie id
    this._projectID = id;
  }
}
