export class InsertResult<T>{


  constructor(private _insertedElement: T, private _updatedElements:T[]=[]){

  }

  public get insertedElement():T{
    return this._insertedElement;
  }

  public get updatedElements():T[]{
    return this._updatedElements;
  }

  public set updatedElements(elements: T[]){
    this._updatedElements = elements;
  }
}
