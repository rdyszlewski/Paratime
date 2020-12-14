import { ITaskItem } from 'app/database/shared/task/task.item';
import { ITaskContainer } from 'app/database/shared/task/task.container';
import { Project } from 'app/database/shared/project/project';

// TODO: dodać jakiś typ do tych elementów i usunąć lub
export interface ITaskList{
  openProject(project: Project):void,
  removeTask(task:ITaskItem): void;
  openDetails(task: ITaskItem):void;
  addTask(container: ITaskContainer): void;
  addTask(task: ITaskItem, container: ITaskContainer): void;
  close();
}
