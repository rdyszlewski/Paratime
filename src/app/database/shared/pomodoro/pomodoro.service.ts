import { PomodoroHistory } from './pomodoro.history';
import { PomodoroFilter } from './pomodoro.filter';

export interface IPomodoroService{
  getById(id: number): Promise<PomodoroHistory>;
  getAll(): Promise<PomodoroHistory[]>;
  getByTask(taskId: number): Promise<PomodoroHistory[]>;
  getByProject(projectId: number): Promise<PomodoroHistory[]>;
  getByFilter(filter:PomodoroFilter): Promise<PomodoroHistory[]>;
  create(pomodoro: PomodoroHistory): Promise<PomodoroHistory>;
  remove(id: number): Promise<void>;
  removeByTask(taskId: number): Promise<number>;
  removeByProject(projectId: number): Promise<number>;
}
