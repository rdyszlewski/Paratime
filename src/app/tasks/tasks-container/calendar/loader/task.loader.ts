import { DataService } from 'app/data.service';
import { Project } from 'app/database/data/models/project';
import { Task } from 'app/database/data/models/task';
import { ICalendarTasks, TasksModel } from '../models/tasks.model';
import { TaskDay } from '../task.day';
import { IDateFilter, NoDateFilter } from './date.filter';
import { IStatusFilter, NoStatusFilter } from './status.filter';

// TODO: przerobić tę klasę jakoś w taki sposób, aby nie było trzeba filtrować odpowiedzi. Najlepiej będzie napisać funkcję do bazyd danych, która przyjmuje filter jako parametr
export class TaskLoader{

  private _dateFilter: IDateFilter;
  private _statusFilter: IStatusFilter;

  constructor(){
    this._dateFilter = new NoDateFilter();
    this._statusFilter = new NoStatusFilter();
  }

  public setDateFilter(dateFilter: IDateFilter){
    this._dateFilter = dateFilter;
  }

  public setStatusFilter(statusFilter: IStatusFilter){
    this._statusFilter = statusFilter;
  }

  public loadTasks(tasksModel: ICalendarTasks, project:Project):Promise<TasksModel>{
    return this.setupTasks(tasksModel.cells, project).then(cells=>{
      return this.getTasksWithoutDate(project).then(tasksWithoutDate=>{
        const result = new TasksModel();
        result.cells = cells;
        result.tasksWithoutDate = tasksWithoutDate;
        return Promise.resolve(result);
      })
    });
  }

  private setupTasks(cells: TaskDay[], project: Project):Promise<TaskDay[]>{
    if(!project){
      return Promise.resolve([]);
    }
    const firstCell = cells[0];
    const lastCell = cells[cells.length-1];
    // TODO: tutaj rozwiązać problem z latami
    const firstDate = new Date(firstCell.year, firstCell.month, firstCell.day);
    const lastDate = new Date(lastCell.year, lastCell.month, lastCell.month);
    return DataService.getStoreManager().getTaskStore().getTasksByDate(firstDate, lastDate).then(tasks=>{
      tasks.filter(x=>x.getProjectID()==project.getId() && this.isCorrectStatus(x)).forEach(task=>{
        const date = task.getDate();
        const day = cells.find(x=>x.day == date.getDate() && x.month == date.getMonth());
        if(day){
          day.addTask(task);
        }
      });
      return Promise.resolve(cells);
    });
  }

  private getTasksWithoutDate(project: Project): Promise<Task[]>{
    // TODO: można to zrobić w drugą stronę. Pobrać wszystkie z projektu
    if(!project){
      return Promise.resolve([]);
    }
    return DataService.getStoreManager().getTaskStore().getTasksByProject(project.getId()).then(result=>{
      const filteredTasks = result.filter(x=>x.getDate()==null);
      return Promise.resolve(filteredTasks);
    });
  }

  protected isCorrectStatus(task: Task){
    console.log(this._dateFilter);
    console.log(this._statusFilter);
    return this._dateFilter.isCorrect(task) && this._statusFilter.isCorrect(task);
  }




}
