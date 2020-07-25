import { min } from 'rxjs/operators';

export class TimeModel{

    private _hours:number = 5;
    private _minutes:number = 6;

    public get hours(){return this._hours};
    public set hours(v:number){
        this._hours = v
    };

    public get minutes(){return this._minutes};
    public set minutes(v:number){
        this._minutes = v
    };

}