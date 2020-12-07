import { TaskRemoveResult } from 'app/database/shared/task/task.remove-result';

export interface IRemoveTaskCallback{
  execute(results: TaskRemoveResult[]);
  unExecute(); // TODO: sprawdzić, czy to będzie poprawnie zrobione
}
