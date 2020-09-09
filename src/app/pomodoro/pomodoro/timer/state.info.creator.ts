import { PomodoroSettings } from '../settings/settings';
import { StateInfo } from './state.info';
import { State } from './state';

export class StateInfoCreator{

  public static getInitialStateInfo(settings: PomodoroSettings): StateInfo{
    let newState = new StateInfo();
    newState.state = State.WORK;
    newState.step = 0;
    newState.interval = 1;
    newState.time = this.getNextTime(newState.state, settings);

    return newState;
  }

  public static getNextStateInfo(currentState: StateInfo, settings: PomodoroSettings):StateInfo{
    // this.runEndCallbacks(); // TODO: to nie tutaj
    let newState = new StateInfo();
    newState.state = this.getNextState(currentState, settings);
    newState.step = this.getNextStep(currentState, settings);
    newState.interval = this.getNextInterval(currentState, settings, newState.state);
    newState.time = this.getNextTime(newState.state, settings);
    return newState;
  }

  public static getNextState(currentState: StateInfo, settings: PomodoroSettings){
    if(currentState.state == State.WORK){
      if(settings.interval == currentState.interval){
          return State.LONG_BREAK;
      }
      return State.SHORT_BREAK;
    }
    return State.WORK;
  }

  private static getNextStep(currentState: StateInfo, settings: PomodoroSettings){
    let currentStep = currentState.step + 1;
    if(currentStep >= settings.interval * 2){
      currentStep = 0;
    }
    return currentStep;
  }

  private static getNextInterval(currentState: StateInfo, settings: PomodoroSettings, newState: State){
    let newInterval = currentState.interval;
    if(newState == State.WORK){
      newInterval++;
    }
    if(newInterval > settings.interval){
      newInterval = 0;
    }
    return newInterval;
  }

  public static getNextTime(newState: State, settings: PomodoroSettings){
    switch(newState){
      case State.WORK:
          return settings.workTime;
      case State.SHORT_BREAK:
          return settings.shortBreakTime;
      case State.LONG_BREAK:
          return settings.longBreakTime;
    }
  }
}
