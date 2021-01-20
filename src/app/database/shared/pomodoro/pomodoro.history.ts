import { State } from 'app/pomodoro/pomodoro/shared/state';
import { PomodoroSummary } from 'app/pomodoro/pomodoro/statistics/summary';

export class PomodoroHistory {

    private _id: number;
    private _time: number;
    private _state: State;
    private _taskId: number;
    private _projectId: number;
    private _startDate: Date;
    private _finishDate: Date;
    // TODO: można coś pomyśleć, jak to zapisać w inny sposób

    public get id():number{
      return this._id;
    }
    public set id(id: number){
      this._id = id;
    }

    public get time(): number{
      return this._time;
    }
    public set time(time: number){
      this._time = time;
    }

    public get state():State{
      return this._state;
    }
    public set state(state: State){
      this._state = state;
    }

    public get taskId():number{
      return this._taskId;
    }
    public set taskId(taskId:number){
      this._taskId = taskId;
    }

    public get projectId(){
      return this._projectId;
    }
    public set projectId(projectId: number){
      this._projectId = projectId;
    }

    public get startDate():Date{
      return this._startDate;
    }
    public set startDate(date: Date){
      this._startDate = date;
    }

    public get finishDate():Date{
      return this._finishDate;
    }
    public set finishDate(date: Date){
      this._finishDate = date;
    }
}

export class PomodoroSummaryAdapter{

  public static createHistory(summary: PomodoroSummary){
    const history = new PomodoroHistory();
    history.state = summary.state;
    history.time = summary.time;
    history.taskId = summary.taskId;
    history.projectId = summary.projectId;
    history.startDate = summary.startDate;
    history.finishDate = summary.finishDate;

    return history;
  }
}
