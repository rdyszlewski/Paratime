import { Task } from 'app/database/data/models/task';

export interface ITaskSelection{
  selectTask(task:Task):void;
  isSelected(task:Task):boolean;
  deselectAll():void;
  // TODO: nazwać to jakoś inaczej
  selectMany(task:Task, list:Task[]);
  getSelectedTasks(originalOrder: Task[]):Task[];
  // TODO: pytanie, czy to będzie obsługiwane tak samo
}
