import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TimeService } from 'app/core/services/time/time.service';
import { PomodoroComponent } from './pomodoro/pomodoro.component';

export enum Mode{
  POMODORO,
  LABELS
}

@Component({
  selector: 'app-side-container',
  templateUrl: './side-container.component.html',
  styleUrls: ['./side-container.component.less']
})
export class SideContainerComponent implements OnInit, AfterViewInit {

  @ViewChild(PomodoroComponent)
  private pomodoroComponent: PomodoroComponent;

  public mode = Mode;

  public _currentMode: Mode;
  public get currentMode():Mode{
    return this._currentMode;
  }

  constructor(private timeService: TimeService) {

  }
  ngAfterViewInit(): void {
    this.pomodoroComponent.addTickCallback("tick", (time)=>this.tickPomodoro(time));  }

  ngOnInit(): void {

  }

  public changeMode(mode: Mode){
    if(mode == this.currentMode){
      this._currentMode = null;
    } else {
      this._currentMode = mode;
    }
  }

  private tickPomodoro(time: string){
    console.log(time);
    this.timeService.setTime(time);
  }

  public closeSidePanel(){
    this._currentMode = null;
  }
}
