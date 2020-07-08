import { IFilterable } from 'app/common/filter/i_filterable';

export class Tag implements IFilterable{
    
    private id: number;
    private name: string = null;

    constructor(name=null){
        this.name = name;
    }

    public getId(){
        return this.id;
    }

    public setId(id:number){
        this.id = id;
    }

    public getName(){
        return this.name;
    }

    public setName(name:string){
        this.name = name;
    }
}