import { Component, OnInit } from '@angular/core';
import { MAT_HAMMER_OPTIONS } from '@angular/material/core';

export enum Mode{
  POMODORO,
  LABELS
}

@Component({
  selector: 'app-side-container',
  templateUrl: './side-container.component.html',
  styleUrls: ['./side-container.component.css']
})
export class SideContainerComponent implements OnInit {

  public mode = Mode;

  public _currentMode: Mode;
  public get currentMode():Mode{
    return this._currentMode;
  }

  constructor() { }

  ngOnInit(): void {
  }

  public changeMode(mode: Mode){
    if(mode == this.currentMode){
      this._currentMode = null;
    } else {
      this._currentMode = mode;
    }
  }

}
