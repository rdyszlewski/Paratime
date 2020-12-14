
import { IFilterable } from 'app/shared/common/filter/filterable';
import { OrderableItem } from '../models/orderable.item';
import { Status } from '../models/status';
import { Stage } from '../stage/stage';
import { Task } from '../task/task';
import { ProjectType } from './project_type';

export class Project extends OrderableItem implements IFilterable{

  private name: string = null;
  private description: string = null;
  private startDate: Date = null;
  private endDate:Date = null;
  private status: Status = null;
  private tasks: Task[] = [];
  private type: ProjectType = null;
  private stages: Stage[] = [];

  constructor(name=null, description=null, status=null, type=null){
    super();
    this.name = name;
    this.description = description;
    this.status = status;
    this.type = type;
  }

  public getName(){
      return this.name;
  }

  public setName(name: string){
      this.name = name;
  }

  public getDescription(){
      return this.description;
  }

  public setDescription(description:string){
      this.description = description;
  }

  public getStartDate():Date{
      return this.startDate;
  }

  public setStartDate(date: Date){
      this.startDate = date;
  }

  public getEndDate(){
      return this.endDate;
  }

  public setEndDate(date: Date){
      this.endDate = date;
  }

  public getStatus(){
      return this.status;
  }

  public setStatus(status: Status){
      this.status = status;
  }

  public addTask(task:Task){
      this.tasks.push(task);
  }

  public removeTask(task: Task){
      let index = this.tasks.indexOf(task);
      if(index >= 0){
          this.tasks.splice(index, 1);
      }
  }

  private getTaskIndex(task:Task){
      for(let i =0; i < this.tasks.length; i++){
          if(this.tasks[i].getId() === task.getId()){
              return i;
          }
      }
      return -1;
  }

  public setTasks(tasks: Task[]){
      this.tasks = tasks;
  }

  public getType(){
      return this.type;
  }

  public setType(type: ProjectType){
    this.type = type;
  }

  public getTasks():Task[]{
    return this.tasks;
  }

  public getStages():Stage[]{
    return this.stages;
  }

  public setStages(stages:Stage[]){
    this.stages = stages;
  }

  public addStage(stage:Stage){
    this.stages.push(stage);
  }

  public removeStage(stage:Stage){
    const index = this.stages.indexOf(stage);
    if(index >= 0){
        this.stages.splice(index, 1);
      }
  }

  public getContainerId(): number {
    return null;
  }
  public setContainerId(id: number): void {
    return;
  }
}
