import { DateAdapter } from "app/database/shared/models/date.adapter";
import { PomodoroHistory } from "app/database/shared/pomodoro/pomodoro.history";
import { State } from "app/pomodoro/pomodoro/shared/state";
import { LocalDTO } from "../task/local.dto";

// TODO: sprawdzić, cz y
export class DexiePomodoroHistoryDTO implements LocalDTO<PomodoroHistory> {

  public id: number;
  public time: number;
  public state: State;
  public taskId: number;
  public projectId: number;
  public startDate: string;
  public finishDate: string;

  constructor(pomodoro: PomodoroHistory){
    this.id = pomodoro.id;
    this.update(pomodoro);
  }


  public getModel(): PomodoroHistory{
    let pomodoro = new PomodoroHistory();
    pomodoro.id = this.id;
    pomodoro.time = this.time;
    pomodoro.state = this.state;
    pomodoro.taskId = this.taskId;
    pomodoro.projectId = this.projectId;
    pomodoro.startDate = DateAdapter.getDate(this.startDate);
    pomodoro.finishDate = DateAdapter.getDate(this.finishDate);

    return pomodoro;
  }

  public update(pomodoro: PomodoroHistory) {
    this.id = pomodoro.id;
    this.time = pomodoro.time;
    this.state = pomodoro.state;
    this.taskId = pomodoro.taskId;
    this.projectId = pomodoro.projectId;
    this.startDate = DateAdapter.getText(pomodoro.startDate);
    this.finishDate = DateAdapter.getText(pomodoro.finishDate);
  }
}
