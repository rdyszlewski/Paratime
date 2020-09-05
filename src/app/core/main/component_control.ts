import * as $ from 'jquery';

export class ComponentControl<T>{
    private component: T;
    private openState:boolean;
    private view: HTMLElement;

    constructor(component:T, view_id: string){
        this.component = component;
        this.view = $("#" + view_id);
    }

    public getComponent():T{
        return this.component;
    }

    public setOpen(open:boolean){
        this.openState = open;
    }

    public open(){
        this.openState = true;
    }

    public close(){
        this.openState = false;
    }

    public isOpen(){
        return this.openState;
    }

    public getView():HTMLElement{
        return this.view;
    }
}