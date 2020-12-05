
export type Predicate<T> = (element: T)=>boolean;

export abstract class RepositoryFilter<T, K>{

  private _conditions: Predicate<T>[] = [];

  constructor(filter: K){
    this.init(filter);
  }

  protected abstract init(filter: K);

  protected addCondition(condition: Predicate<T>){
    this._conditions.push(condition);
  }

  public apply(element: T): boolean{
    for(let i=0; i< this._conditions.length; i++){
      if(!this._conditions[i](element)){
        return false;
      }
    }
    return true;
  }

  protected getDateFormat(date: Date){
    return `${ date.getFullYear() }-${ date.getMonth() }-${date.getDate()}`;
  }
}
