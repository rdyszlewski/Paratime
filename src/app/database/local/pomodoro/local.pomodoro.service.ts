import { IPomodoroService } from 'app/database/shared/pomodoro/pomodoro.service';
import { PomodoroHistory } from 'app/database/shared/pomodoro/pomodoro.history';
import { PomodoroFilter } from 'app/database/shared/pomodoro/pomodoro.filter';
import { LocalPomodoroRepository } from './local.pomodoro.repository';
import { DexiePomodoroHistoryDTO } from './local.pomodoro';

export class LocalPomodoroService implements IPomodoroService{

  constructor(private repository: LocalPomodoroRepository){

  }

  public getById(id: number): Promise<PomodoroHistory> {
    let action = this.repository.findById(id);
    return this.mapToPomodoroAction(action);
  }


  // TODO: zrobić metodę, która będzie obsługiwać wszystkie modele dto
  private mapToPomodoroAction(action: Promise<DexiePomodoroHistoryDTO>): Promise<PomodoroHistory>{
    return action.then(result=>{
      return Promise.resolve(result.getModel());
    });
  }

  private mapToPomodoroListAction(action: Promise<DexiePomodoroHistoryDTO[]>): Promise<PomodoroHistory[]>{
    return action.then(results=>{
      return Promise.resolve(results.map(x=>x.getModel()));
    });
  }

  public getAll(): Promise<PomodoroHistory[]> {
    let action = this.repository.findAll();
    return this.mapToPomodoroListAction(action);
  }

  public getByTask(taskId: number): Promise<PomodoroHistory[]> {
    let action =  this.repository.findByTask(taskId);
    return this.mapToPomodoroListAction(action);
  }

  public getByProject(projectId: number): Promise<PomodoroHistory[]> {
    let action =  this.repository.findByProject(projectId);
    return this.mapToPomodoroListAction(action);
  }

  public getByFilter(filter: PomodoroFilter): Promise<PomodoroHistory[]> {
    let action =  this.repository.findByFilter(filter);
    return this.mapToPomodoroListAction(action);
  }

  public create(pomodoro: PomodoroHistory): Promise<PomodoroHistory> {
    // TODO: przerobić to jakoś fajnie
    let dto = new DexiePomodoroHistoryDTO(pomodoro);
    return this.repository.insert(dto).then(insertedId=>{
      return this.getById(insertedId);
    });
  }

  public remove(id: number): Promise<void> {
    return this.repository.remove(id);
  }

  public removeByTask(taskId: number): Promise<number> {
    return this.repository.removeByTask(taskId);
  }

  public removeByProject(projectId: number): Promise<number> {
    return this.repository.removeByProject(projectId);
  }
}
