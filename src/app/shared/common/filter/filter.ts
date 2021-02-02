import { IFilterable } from './filterable';

export class Filter<T extends IFilterable>{

  private filteredItems: T[] = [];
  private lastFilter: string = "";

  public filter(filterValue: string, items: T[]):void {
    if(filterValue == null){
      filterValue = this.lastFilter;
      if(filterValue == null){
        return;
      }
    }

    const result = [];
    items.forEach(item=>{
      // TODO: widocznie tutaj wystepują itemy bez nazwy
      if(item.name.includes(filterValue)){
        result.push(item);
      }
    });
    this.filteredItems = result;
    this.lastFilter = filterValue;
  }

  public getFilteredItems(){
    return this.filteredItems;
  }
}
