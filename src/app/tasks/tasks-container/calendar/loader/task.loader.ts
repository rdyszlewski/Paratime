import { DataService } from 'app/data.service';
import { Project } from 'app/database/data/models/project';
import { Task } from 'app/database/data/models/task';
import { TaskFilter } from 'app/database/filter/task.filter';
import { ICalendarTasks, TasksModel } from '../models/tasks.model';
import { TaskDay } from '../task.day';
import { IDateFilter, NoDateFilter } from './date.filter';
import { IStatusFilter, NoStatusFilter } from './status.filter';

// TODO: przerobić tę klasę jakoś w taki sposób, aby nie było trzeba filtrować odpowiedzi. Najlepiej będzie napisać funkcję do bazyd danych, która przyjmuje filter jako parametr
export class TaskLoader{

  private _dateFilter: IDateFilter;
  private _statusFilter: IStatusFilter;

  constructor(private dataService: DataService){
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
      console.log("cells");
      console.log(cells);
      let filter = TaskFilter.getBuilder().setProject(project.getId()).setHasDate(false).build();
      return this.dataService.getTaskService().getByFilter(filter).then(tasksWithoutDate=>{
        const result = new TasksModel();
        result.cells = cells;
        result.tasksWithoutDate = tasksWithoutDate;
        return Promise.resolve(result);
      });
    });
  }

  private setupTasks(cells: TaskDay[], project: Project):Promise<TaskDay[]>{
    if(!project){
      return Promise.resolve([]);
    }
    const firstCell = cells[0];
    const lastCell = cells[cells.length-1];
    const firstDate = new Date(firstCell.year, firstCell.month, firstCell.day);
    const lastDate = new Date(lastCell.year, lastCell.month, lastCell.month);
    let filter = TaskFilter.getBuilder().setProject(project.getId()).setStartDateRange(firstDate, lastDate).build();
    return this.dataService.getTaskService().getByFilter(filter).then(tasks=>{
      let actions = tasks.map(task=>{
        let day = this.findDay(task.getDate(), cells);
        day.addTask(task);
      });
      return Promise.all(actions).then(_=>{
          return Promise.resolve(cells);
        });
      });

  }

  private findDay(date: Date, cells: TaskDay[]){
    return cells.find(cell=>cell.day == date.getDay()-1 && cell.month == date.getMonth() && cell.year == date.getFullYear());
  }

  protected isCorrectStatus(task: Task){
    return this._dateFilter.isCorrect(task) && this._statusFilter.isCorrect(task);
  }

}
