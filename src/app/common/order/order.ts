import { preserveWhitespacesDefault } from '@angular/compiler'

export interface IOrderable{
    getId():number;
    getPrevId():number;
    getNextId():number;
    setId(id:number):void;
    setPrevId(id:number):void;
    setNextId(id:number):void;
}