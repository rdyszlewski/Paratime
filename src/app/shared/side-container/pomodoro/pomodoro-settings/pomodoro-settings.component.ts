import { Component, OnInit } from '@angular/core';
import { PomodoroService } from 'app/pomodoro/pomodoro/pomodoro.service';
import { StateControl, SettingsAnswer } from 'app/pomodoro/pomodoro/settings/settings';
import { PomodoroSettingsStore } from 'app/pomodoro/pomodoro/settings/settings.storage';

@Component({
  selector: 'app-pomodoro-settings',
  templateUrl: './pomodoro-settings.component.html',
  styleUrls: ['./pomodoro-settings.component.less']
})
export class PomodoroSettingsComponent implements OnInit {

  stateControl = StateControl;
  settingsAnswer = SettingsAnswer;

  constructor(private _service: PomodoroService) { }

  ngOnInit(): void {
  }

  public get service(): PomodoroService{
    return this._service;
  }


}
