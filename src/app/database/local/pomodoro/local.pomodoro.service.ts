import { IPomodoroService } from 'app/database/shared/pomodoro/pomodoro.service';
import { PomodoroHistory } from 'app/database/shared/pomodoro/pomodoro.history';
import { PomodoroFilter } from 'app/database/shared/pomodoro/pomodoro.filter';
import { LocalPomodoroRepository } from './local.pomodoro.repository';

export class LocalPomodoroService implements IPomodoroService{

  constructor(private repository: LocalPomodoroRepository){

  }

  public getById(id: number): Promise<PomodoroHistory> {
    return this.repository.findById(id);
  }

  public getAll(): Promise<PomodoroHistory[]> {
    return this.repository.findAll();
  }

  public getByTask(taskId: number): Promise<PomodoroHistory[]> {
    return this.repository.findByTask(taskId);
  }

  public getByProject(projectId: number): Promise<PomodoroHistory[]> {
    return this.repository.findByProject(projectId);
  }

  public getByFilter(filter: PomodoroFilter): Promise<PomodoroHistory[]> {
    return this.repository.findByFilter(filter);
  }

  public create(pomodoro: PomodoroHistory): Promise<PomodoroHistory> {
    return this.repository.insert(pomodoro).then(insertedId=>{
      return this.repository.findById(insertedId);
    })
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
