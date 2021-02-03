
import { IFilterable } from 'app/shared/common/filter/filterable';
import { OrderableItem } from '../models/orderable.item';
import { Status } from '../models/status';
import { Stage } from '../stage/stage';
import { Task } from '../task/task';
import { ProjectType } from './project_type';

export class Project extends OrderableItem implements IFilterable{

  private _name: string = null;
  private _description: string = null;
  private _startDate: Date = null;
  private _endDate:Date = null;
  private _status: Status = null;
  private _tasks: Task[] = [];
  private _type: ProjectType = null;
  private _stages: Stage[] = [];

  constructor(name=null, description=null, status=null, type=null){
    super();
    this._name = name;
    this._description = description;
    this._status = status;
    this._type = type;
  }

  public get name(): string{
      return this._name;
  }

  public set name(name: string){
      this._name = name;
  }

  public get description(){
      return this._description;
  }

  public set description(description:string){
      this._description = description;
  }

  public get startDate():Date{
      return this._startDate;
  }

  public set startDate(date: Date){
      this._startDate = date;
  }

  public get endDate(){
      return this._endDate;
  }

  public set endDate(date: Date){
      this._endDate = date;
  }

  public get status(){
      return this._status;
  }

  public set status(status: Status){
      this._status = status;
  }

  public addTask(task:Task){
      this._tasks.push(task);
  }

  public removeTask(task: Task){
      let index = this._tasks.indexOf(task);
      if(index >= 0){
          this._tasks.splice(index, 1);
      }
  }

  public get tasks():Task[]{
    return this._tasks;
  }

  public set tasks(tasks: Task[]){
      this._tasks = tasks;
  }

  public get type(){
      return this._type;
  }

  public set type(type: ProjectType){
    this._type = type;
  }

  public get stages():Stage[]{
    return this._stages;
  }

  public set stages(stages:Stage[]){
    this._stages = stages;
  }

  public addStage(stage:Stage){
    this._stages.push(stage);
  }

  public removeStage(stage:Stage){
    const index = this._stages.indexOf(stage);
    if(index >= 0){
        this._stages.splice(index, 1);
      }
  }

  // TODO: może sprawdzić, o co tutaj chodzi
  public get containerId(): number {
    return null;
  }

  public set containerId(id: number){
    return;
  }
}
