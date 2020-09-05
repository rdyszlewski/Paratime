import { Project } from 'app/data/models/project';
import { Task } from 'app/data/models/task';
import { KanbanTask } from 'app/data/models/kanban';
import { ITaskItem } from 'app/data/models/task.item';
import { ITaskContainer } from 'app/data/models/task.container';

// TODO: dodać jakiś typ do tych elementów i usunąć lub
export interface ITaskList{
  openProject(project: Project):void,
  removeTask(task:ITaskItem): void;
  openDetails(task: ITaskItem):void;
  addTask(container: ITaskContainer): void;
  addTask(task: ITaskItem, container: ITaskContainer): void;
}
