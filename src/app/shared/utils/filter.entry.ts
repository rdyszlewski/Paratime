class FilterEntry<T>{
  private condition: ()=>boolean;
  private predicate: (element: T)=>boolean;

  constructor(condition: ()=>boolean, predicate:(element: T)=>boolean){
    this.condition = condition;
    this.predicate = predicate;
  }

  public applyCondition():boolean{
    return this.condition();
  }

  public applyPredicate(element: T):boolean{
    return this.predicate(element);
  }
}
