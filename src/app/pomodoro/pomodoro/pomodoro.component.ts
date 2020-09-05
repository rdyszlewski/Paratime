import { Component, OnInit } from '@angular/core';
import { PomodoroModel } from './model';
import { State } from './state';
import { PomodoroSettingsStore } from './storage/settings.storage';
import { Task } from 'app/database/data/models/task';
import { PomodoroHistory } from 'app/database/data/models/pomodoro.history';
import { DataService } from 'app/data.service';
import { TickCallback, EndCallback } from './timer';



@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrls: ['./pomodoro.component.css']
})
export class PomodoroComponent implements OnInit {

  public statisticsOpen = false;
  public model: PomodoroModel = new PomodoroModel();
  public state = State;
  constructor() { }

  ngOnInit(): void {
    this.addEndCallback("save", (history)=>this.savePomodoroStatistics(history));
  }

  public addTickCallback(name: string, callback: TickCallback){
    this.model.getTimer().addTickCallback(name, callback);
  }

  public addEndCallback(name: string, callback: EndCallback){
    this.model.getTimer().addEndCallback(name, callback);
  }

  public removeTickCallback(name: string){
    this.model.getTimer().removeTickCallback(name);
  }

  public removeEndCallback(name: string){
    this.model.getTimer().removeEndCallback(name);
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
    console.log("Traw zapisywanie wyników Pomodoro");
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

  public isStatisticsEnabled():boolean{
    return !this.model.getTimer().isTimerRunning() && !this.model.getTimer().isTimerPause();
  }
}
