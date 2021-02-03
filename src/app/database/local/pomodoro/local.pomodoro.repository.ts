import { PomodoroRepositoryFilter } from 'app/database/local/local.pomodoro.filter';
import { PomodoroFilter } from 'app/database/shared/pomodoro/pomodoro.filter';
import { DexiePomodoroHistoryDTO } from './local.pomodoro';

type PomodoroType = DexiePomodoroHistoryDTO;

export class LocalPomodoroRepository {

  constructor(private table: Dexie.Table<PomodoroType, number>){
  }

  public findById(id: number): Promise<PomodoroType>{
    return this.table.get(id);
  }

  public findAll(): Promise<PomodoroType[]>{
    return this.table.toArray();
  }

  public findByTask(taskId: number): Promise<PomodoroType[]>{
    return this.table.where("taskId").equals(taskId).toArray();
  }

  public findByProject(projectId: number): Promise<PomodoroType[]>{
    return this.table.where("projectId").equals(projectId).toArray();
  }

  public findByFilter(filter: PomodoroFilter): Promise<PomodoroType[]>{
    let pomodoroFilter = new PomodoroRepositoryFilter(filter);
    return this.table.filter(pomodoro=>pomodoroFilter.apply(pomodoro)).toArray();
  }

  public insert(pomodoro: PomodoroType): Promise<number>{
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
