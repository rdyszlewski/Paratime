import { Component, OnInit } from '@angular/core';
import { PomodoroModel } from './model';
import { State } from './state';

@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrls: ['./pomodoro.component.css']
})
export class PomodoroComponent implements OnInit {

  public model: PomodoroModel = new PomodoroModel();
  public state = State;
  constructor() { }



  ngOnInit(): void {
  }

  // TODO: refaktoryzacja
  public getStatesNumbers(){
    let numbers = [];
    for(let i =0; i<this.model.getSettings().getInterval() * 2; i++){
      numbers.push(i);
    }
    return numbers;
  }

  public isWorkState(index:number){
    if(index % 2 == 0){
      return true;
    }
    return false;
  }

  public isShortBreakState(index:number){
    if(index % 2 != 0 && index != this.model.getSettings().getInterval() * 2 - 1){
      return true;
    }
    return false;
  }

  public isLongBreakState(index:number){
    if(index == this.model.getSettings().getInterval() * 2 - 1){
      return true;
    }
    return false;
  }

  public isCurrentState(index:number){
    if(index == this.model.getTimer().getStep()){
      return true;
    }
    return false;
  }

}
