import { Project } from 'app/database/data/models/project';
import { Task } from 'app/database/data/models/task';
import { KanbanTask } from 'app/database/data/models/kanban';
import { ITaskItem } from 'app/database/data/models/task.item';
import { ITaskContainer } from 'app/database/data/models/task.container';

// TODO: dodać jakiś typ do tych elementów i usunąć lub
export interface ITaskList{
  openProject(project: Project):void,
  removeTask(task:ITaskItem): void;
  openDetails(task: ITaskItem):void;
  addTask(container: ITaskContainer): void;
  addTask(task: ITaskItem, container: ITaskContainer): void;
}
