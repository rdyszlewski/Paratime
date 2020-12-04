import { KanbanTask } from '../data/models/kanban';
import { Task } from '../data/models/task';
import { InsertResult } from '../model/insert-result';
import { TaskInsertData } from '../model/task.insert-data';
import { TaskInsertResult } from '../model/task.insert-result';
import { TaskRemoveResult } from '../model/task.remove-result';

export interface IKanbanTaskService{
  getById(id: number): Promise<KanbanTask>;
  getByColumn(columnId: number): Promise<KanbanTask[]>;
  getByTask(taskId: number): Promise<KanbanTask>;
  create(data: TaskInsertData): Promise<TaskInsertResult>; // TODO: może to zrobić w ten sposób, że dodaje tylko kanbantask bez zadania
  remove(task: Task): Promise<TaskRemoveResult>;
  removeByColumn(columnId: number): Promise<number>;
  update(task: KanbanTask): Promise<KanbanTask>;
  changeOrder(currentTask: KanbanTask, previousTask: KanbanTask, currentIndex: number, previousIndex: number);
  changeColumn(task: KanbanTask, currentTask: KanbanTask, columnId: number);
}
