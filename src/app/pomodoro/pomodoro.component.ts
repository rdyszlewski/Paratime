import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PomodoroModel } from './model';
import { State } from './state';
import { PomodoroSettingsStore } from './storage/settings.storage';
import { Task } from 'app/models/task';
import { PomodoroHistory } from 'app/models/pomodoro.history';
import { DataService } from 'app/data.service';

@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrls: ['./pomodoro.component.css']
})
export class PomodoroComponent implements OnInit {

  @Output() tickEvent: EventEmitter<string> = new EventEmitter();
  private endEvent: EventEmitter<PomodoroHistory> = new EventEmitter();
  
  public statisticsOpen = false;
  public model: PomodoroModel = new PomodoroModel();
  public state = State;
  constructor() { }

  ngOnInit(): void {
    this.model.getTimer().setTimeEmitter(this.tickEvent);

    this.endEvent.subscribe(entry=>{
      this.savePomodoroStatistics(entry);
    });
    this.model.getTimer().setEndEmitter(this.endEvent);
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

  public savePomodoroStatistics(entry: PomodoroHistory){
    // TODO: zrobić tutaj jakąś magie
    // TODO: zastanowić się, czy chcemy zapisywać wyniki bez przypisanego zadania
    if(this.model.getTimer().getState()==State.WORK){
      if(this.model.getCurrentTask()){
        entry.setTaskId(this.model.getCurrentTask().getId());
        entry.setProjectId(this.model.getCurrentTask().getProjectID());
      }
      DataService.getStoreManager().getPomodoroStore().create(entry);
    }
  }

  public openStatistics(){
    this.statisticsOpen = true;
  }

  public closeStatistics(){
    this.statisticsOpen = false;
  }
}
