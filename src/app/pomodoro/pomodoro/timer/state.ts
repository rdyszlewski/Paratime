export enum State{
    WORK,
    SHORT_BREAK,
    LONG_BREAK
}

export class BreakHelper{
  public  static isBreak(state: State){
    return state == State.SHORT_BREAK || state == State.LONG_BREAK;
  }
}

export enum TimerState{
  TICKING,
  STOPED,
  PAUSED,
  CONTINUATION,
  FINISHED
}
