import { Task } from 'app/database/data/models/task';

export class TaskContainer{
  private _task: Task;
  private _size: number;
  private _position: number = 1;
  private _offset: number = 0;

  private _originalPosition: number;
  private _isHided = false;


  public get task(): Task{
    return this._task;
  }

  public get size(): number{
    return this._size;
  }

  public set size(value: number){
    this._size = value;
  }

  public get position(): number{
    return this._position;
  }

  public get offset():number{
    return this._offset;
  }

  public set offset(value: number){
    this._offset = value;
  }


  public hide(){
    if(!this._isHided){
      this._originalPosition = this._position;
      this._position = -1;
      this._isHided = true;
    }
  }

  public show(){
    this._position = this._originalPosition;
    this._isHided = false;
  }

  // public getHeight():string{
  //   return this.size + "%";
  // }

  constructor(task: Task){
    this._task = task;
  }
}