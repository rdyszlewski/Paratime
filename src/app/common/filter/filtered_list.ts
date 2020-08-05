import { IFilterable } from './filterable';


export class FilteredList<T extends IFilterable>{
    private source: T[] = [];
    private list: T[]=[];
    private lastFilter:string = "";

    public setSource(source: T[]){
        this.source = source;
        this.filter(this.lastFilter);
    }

    public getElements():T[]{
        return this.list;
    }

    public filter(filterValue:string):void{
        this.list = [];
        this.source.filter(x=>x.getName().includes(filterValue)).forEach(project=>{
            this.list.push(project);
        });
        this.lastFilter = filterValue;
    }

    public refresh():void{
      this.filter(this.lastFilter);
    }

}
