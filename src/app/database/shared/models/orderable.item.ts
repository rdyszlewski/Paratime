export abstract class OrderableItem{
  // TODO: chyba lepiej będzie to przenieść gdzies do zarzadzania bazą
  protected _id: number;
  protected _successor: number = -1;
  protected _position: Position = Position.NORMAL;

  public get id():number{
    return this._id;
  }

  public set id(value:number){
    this._id = value;
  }

  public get successorId():number{
    return this._successor;
  }

  public set successorId(value: number){
    this._successor = value;
  }

  public get position():Position{
    return this._position;
  }

  public set position(value:Position){
    this._position = value;
  }

  public isHead(){
    return this._position == Position.HEAD;
  }

  public abstract get containerId():number;
  public abstract set containerId(id:number);
}

export enum Position{
  NORMAL = 0,
  HEAD = 1,
}
