import { TimerState } from './state';


export class TimerFormatter{

  public static getTimeText(time: number, timerState: TimerState = TimerState.TICKING):string{
    const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        const text = this.formatTime(minutes, seconds);
        switch(timerState){
          case TimerState.TICKING:
            return text;
          case TimerState.CONTINUATION:
            return "+ " + text;
        }
        return text;
  }

  private static formatTime(minutes:number, seconds:number){
    return this.pad(minutes, 2) + ":" + this.pad(seconds, 2);
  }

  private static pad(num:number, size:number): string {
      let s = num+"";
      while (s.length < size) s = "0" + s;
      return s;
  }
}
