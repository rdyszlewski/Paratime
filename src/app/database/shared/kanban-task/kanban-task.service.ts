import { Task } from '../task/task';
import { TaskInsertData } from '../task/task.insert-data';
import { TaskInsertResult } from '../task/task.insert-result';
import { TaskRemoveResult } from '../task/task.remove-result';
import { KanbanTask } from './kanban-task';

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
