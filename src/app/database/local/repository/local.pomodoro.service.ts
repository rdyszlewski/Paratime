import { PomodoroHistory } from 'app/database/data/models/pomodoro.history';
import { PomodoroRepositoryFilter } from 'app/database/filter/local.pomodoro.filter';
import { PomodoroFilter } from 'app/database/filter/pomodoro.filter';

export class LocalPomodoroRepository {

  constructor(private table: Dexie.Table<PomodoroHistory, number>){
  }

  public findById(id: number): Promise<PomodoroHistory>{
    return this.table.get(id);
  }

  public findAll(): Promise<PomodoroHistory[]>{
    return this.table.toArray();
  }

  public findByTask(taskId: number): Promise<PomodoroHistory[]>{
    return this.table.where("taskId").equals(taskId).toArray();
  }

  public findByProject(projectId: number): Promise<PomodoroHistory[]>{
    return this.table.where("projectId").equals(projectId).toArray();
  }

  public findByFilter(filter: PomodoroFilter): Promise<PomodoroHistory[]>{
    let pomodoroFilter = new PomodoroRepositoryFilter(filter);
    return this.table.filter(pomodoro=>pomodoroFilter.apply(pomodoro)).toArray();
  }

  public insert(pomodoro: PomodoroHistory): Promise<number>{
    return this.table.add(pomodoro);
  }

  public remove(id: number): Promise<void>{
    return this.table.delete(id);
  }

  public removeByTask(taskId: number): Promise<number>{
    return this.table.where("taskId").equals(taskId).delete();
  }

  public removeByProject(projectid: number): Promise<number>{
    return this.table.where("projectId").equals(projectid).delete();
  }

}
