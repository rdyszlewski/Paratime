import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PomodoroModel } from './model';
import { State } from './state';
import { PomodoroSettingsStore } from './storage/settings.storage';
import { Task } from 'app/models/task';

@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrls: ['./pomodoro.component.css']
})
export class PomodoroComponent implements OnInit {

  @Output() tickEvent: EventEmitter<string> = new EventEmitter();

  public model: PomodoroModel = new PomodoroModel();
  public state = State;
  constructor() { }

  ngOnInit(): void {
    this.model.getTimer().setEmitter(this.tickEvent);
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

  public getStartButtonContent(){
    if(!this.model.getTimer().isStateFinished()){
      return "Rozpocznij pracę";
    }
    switch(this.model.getTimer().getNextState()){
      case State.WORK:
        return "Rozpocznij pracę"
      case State.SHORT_BREAK:
        return "Rozpocznij krótką przerwę";
      case State.LONG_BREAK:
        return "Rozpocznij długą przerwę";
    }
  }

  public updateSettings(){
    PomodoroSettingsStore.saveSettings(this.model.getSettings());
  }

  public addTaskToPomodoro(task:Task){
    this.model.setCurrentTask(task);
  }
}
