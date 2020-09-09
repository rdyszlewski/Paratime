import { State } from 'app/pomodoro/pomodoro/timer/state';
import { PomodoroSummary } from 'app/pomodoro/pomodoro/statistics/summary';

export class PomodoroHistory {

    private id: number;
    private time: number;
    private state: State;
    private taskId: number;
    private projectId: number;
    private startDate: Date;
    private finishDate: Date;
    // TODO: można coś pomyśleć, jak to zapisać w inny sposób

    public getId():number{
      return this.id;
    }
    public setId(id: number):void{
      this.id = id;
    }

    public getTime(): number{
      return this.time;
    }
    public setTime(time: number){
      this.time = time;
    }

    public getState():State{
      return this.state;
    }
    public setState(state: State){
      this.state = state;
    }

    public getTaskId():number{
      return this.taskId;
    }
    public setTaskId(taskId:number){
      this.taskId = taskId;
    }

    public getProjectId(){
      return this.projectId;
    }
    public setProjectId(projectId: number){
      this.projectId = projectId;
    }

    public getStartDate():Date{
      return this.startDate;
    }
    public setStartDate(date: Date): void{
      this.startDate = date;
    }

    public getFinishDate():Date{
      return this.finishDate;
    }
    public setFinishDate(date: Date){
      this.finishDate = date;
    }
}

export class PomodoroSummaryAdapter{

  public static createHistory(summary: PomodoroSummary){
    const history = new PomodoroHistory();
    history.setState(summary.state);
    history.setTime(summary.time);
    history.setTaskId(summary.taskId);
    history.setProjectId(summary.projectId);
    history.setStartDate(summary.startDate);
    history.setFinishDate(summary.finishDate);

    return history;
  }
}
