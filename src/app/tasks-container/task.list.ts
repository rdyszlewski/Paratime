import { Project } from 'app/models/project';
import { Task } from 'app/models/task';
import { KanbanTask } from 'app/models/kanban';
import { ITaskItem } from 'app/models/task.item';
import { ITaskContainer } from 'app/models/task.container';

// TODO: dodać jakiś typ do tych elementów i usunąć lub
export interface ITaskList{
  openProject(project: Project):void,
  removeTask(task:ITaskItem): void;
  openDetails(task: ITaskItem):void;
  addTask(container: ITaskContainer): void;
  addTask(task: ITaskItem, container: ITaskContainer): void;
}
