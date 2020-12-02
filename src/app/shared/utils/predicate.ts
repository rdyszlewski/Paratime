class Predicate{
  private predicates: (()=>boolean)[] = [];

  constructor(predicate: ()=>boolean = null){
    if(predicate){
      this.predicates.push(predicate);
    }
  }

  public add(predicate: ()=>boolean){
      this.predicates.push(predicate);
      console.log(predicate);
  }

  public apply():boolean{
      for(let i=0; i< this.predicates.length; i++){
          if(!this.predicates[i]()){
              return false;
          }
      }
      return true;
  }
}
