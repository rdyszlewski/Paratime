import { InsertResult } from '../insert-result';
import { Subtask } from './subtask';

export interface ISubtaskService{
  getById(id: number): Promise<Subtask>;
  getByTask(taskId: number): Promise<Subtask[]>;
  create(subtask: Subtask): Promise<InsertResult<Subtask>>;
  remove(subtask: Subtask): Promise<Subtask[]>;
  removeByTask(taskId: number): Promise<void>;
  update(subtask: Subtask): Promise<Subtask>;
  changeOrder(currentSubtask: Subtask, previousSubtask: Subtask, currentIndex: number, previousIndex: number);
}
