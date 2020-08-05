export class OrderableItem{
  protected id: number;
  protected successor: number = -1;
  protected position: Position;

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
}

export enum Position{
  HEAD
}
