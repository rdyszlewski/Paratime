export abstract class OrderableItem{
  // TODO: chyba lepiej będzie to przenieść gdzies do zarzadzania bazą
  protected id: number;
  protected successor: number = -1;
  protected position: Position = Position.NORMAL;

  public getId():number{
    return this.id;
  }

  public setId(id:number):void{
    this.id = id;
  }

  public getSuccessorId():number{
    return this.successor;
  }

  public setSuccessorId(successor: number): void{
    this.successor = successor;
  }

  public getPosition():Position{
    return this.position;
  }

  public setPosition(position:Position):void{
    this.position = position;
  }

  public isHead(){
    return this.position == Position.HEAD;
  }

  public abstract getContainerId():number;
  public abstract setContainerId(id:number):void;
}

export enum Position{
  NORMAL = 0,
  HEAD = 1,
}
