import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  private time:string;

  constructor() { }

  public getTime():string{
    return this.time;
  }

  public setTime(time:string){
    this.time = time;
  }
}
