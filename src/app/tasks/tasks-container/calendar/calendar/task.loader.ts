import { DataService } from 'app/data.service';
import { Project } from 'app/database/data/models/project';
import { Status } from 'app/database/data/models/status';
import { Task } from 'app/database/data/models/task';
import { TaskDay } from '../task.day';


export enum TaskStatus{
  ACTIVE,
  ACTIVE_DATE,
  ALL
}


export class TaskLoaderResult{
  private _cells: TaskDay[];
  private _tasksWithoutDate: Task[];

  public get cells(): TaskDay[] {
    return this._cells;
  }
  public set cells(value: TaskDay[]) {
    this._cells = value;
  }

  public get tasksWithoutDate(): Task[] {
    return this._tasksWithoutDate;
  }
  public set tasksWithoutDate(value: Task[]) {
    this._tasksWithoutDate = value;
  }
}

// TODO: przerobić tę klasę jakoś w taki sposób, aby nie było trzeba filtrować odpowiedzi. Najlepiej będzie napisać funkcję do bazyd danych, która przyjmuje filter jako parametr
export class TaskLoader{

  public static loadTasks(cells: TaskDay[], project: Project, year:number, status: TaskStatus):Promise<TaskLoaderResult>{
    return this.setupTasks(cells, project, year, status).then(cells=>{
      return this.getTasksWithoutDate(project).then(tasksWithoutDate=>{
        const result = new TaskLoaderResult();
        result.cells = cells;
        result.tasksWithoutDate = tasksWithoutDate;
        return Promise.resolve(result);
      })
    });
  }

  private static setupTasks(cells: TaskDay[], project: Project, year: number, status: TaskStatus):Promise<TaskDay[]>{
    if(!project){
      return Promise.resolve([]);
    }
    const firstCell = cells[0];
    const lastCell = cells[cells.length-1];
    // TODO: tutaj rozwiązać problem z latami
    const firstDate = new Date(year, firstCell.month, firstCell.day);
    const lastDate = new Date(year, lastCell.month, lastCell.month);
    return DataService.getStoreManager().getTaskStore().getTasksByDate(firstDate, lastDate).then(tasks=>{
      tasks.filter(x=>x.getProjectID()==project.getId() && this.isCorrectStatus(x, status)).forEach(task=>{
        const date = task.getDate();
        const day = cells.find(x=>x.day == date.getDate() && x.month == date.getMonth());
        if(day){
          day.addTask(task);
        }
      });
      return Promise.resolve(cells);
    });
  }

  private static getTasksWithoutDate(project: Project): Promise<Task[]>{
    // TODO: można to zrobić w drugą stronę. Pobrać wszystkie z projektu
    if(!project){
      return Promise.resolve([]);
    }
    return DataService.getStoreManager().getTaskStore().getTasksByProject(project.getId()).then(result=>{
      const filteredTasks = result.filter(x=>x.getDate()==null);
      return Promise.resolve(filteredTasks);
    });
  }

  private static isCorrectStatus(task: Task, taskStatus: TaskStatus){
    switch(taskStatus){
      case TaskStatus.ACTIVE:
        return this.isActiveTask(task);
      case TaskStatus.ACTIVE_DATE:
        //TODO: spróbować przerobić, aby nie musiał za każdym razem tworzyć daty
        return this.isActiveTask(task) && task.getDate() >= new Date();
      case TaskStatus.ALL:
        return true;
    }
  }

  private static isActiveTask(task: Task){
    return task.getStatus() != Status.ENDED && task.getStatus() != Status.CANCELED;
  }
}
