import { DataService } from 'app/data.service';
import { Project } from 'app/database/data/models/project';
import { Task } from 'app/database/data/models/task';
import { TaskDay } from '../task.day';

export class TaskLoader{

  public static loadTasks(cells: TaskDay[], project: Project, year:number){
    const firstCell = cells[0];
    const lastCell = cells[cells.length-1];
    // TODO: tutaj rozwiązać problem z latami
    const firstDate = new Date(year, firstCell.month, firstCell.day);
    const lastDate = new Date(year, lastCell.month, lastCell.month);
    DataService.getStoreManager().getTaskStore().getTasksByDate(firstDate, lastDate).then(tasks=>{
      console.log(tasks);
      this.setupTasks(tasks, cells, project);
    });
  }

  private static setupTasks(tasks: Task[], cells: TaskDay[], project: Project){
    if(!project){
      return;
    }
    tasks.filter(x=>x.getProjectID()==project.getId()).forEach(task=>{
      const date = task.getDate();
      const day = cells.find(x=>x.day == date.getDate() && x.month == date.getMonth());
      if(day){
        day.tasks.push(task);
      }
    });
  }
}
