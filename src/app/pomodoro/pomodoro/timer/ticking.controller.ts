import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { TimerState } from '../shared/state';
import { TimerTickCallback } from './timer';
import { TimerInfo } from './timer.info';

export type FinishTickingCallback = (time: number)=>void;

export class TickingController{

  private _timerInfo: TimerInfo;
  private _tickCallback: TimerTickCallback;
  private _finishTickingCallback;
   // prevent running many countdowns in the same time
  private _currentCountdownID: number = 0;

  constructor(timerInfo: TimerInfo, tickCallback: TimerTickCallback, finishTickingCallback: FinishTickingCallback){
    this._timerInfo = timerInfo;
    this._tickCallback = tickCallback;
    this._finishTickingCallback = finishTickingCallback;
  }

  public startTicking(){
    this._currentCountdownID++;
    const countdownID = this._currentCountdownID;
    interval(1000).pipe(takeWhile(()=> this.shouldTicking(countdownID))).subscribe(()=>{
      this.tick();
    });
  }

  private shouldTicking(countdownID: number){
    return (this._timerInfo.timerState == TimerState.TICKING
      || this._timerInfo.timerState == TimerState.CONTINUATION)
      && this._currentCountdownID == countdownID
  }

  private tick(){
    switch(this._timerInfo.timerState){
      case TimerState.TICKING:
        this.tickNormal();
        break;
      case TimerState.CONTINUATION:
        this.tickContinuation();
        break;
    }
  }

  private tickNormal(){
    this._timerInfo.time--;
    this._timerInfo.stateTime++;
    if(this.isTickingFinished()){
        this._timerInfo.time = 0;
        this._finishTickingCallback();
    } else {
      this._tickCallback(this._timerInfo.time);
    }
  }

  private isTickingFinished() {
    return this._timerInfo.time < 0;
  }

  private tickContinuation(){
    this._timerInfo.time++;
  }
}
