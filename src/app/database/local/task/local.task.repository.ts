import { Task } from 'app/database/shared/task/task';
import { TaskRepositoryFilter } from 'app/database/local/task/local.task.filter';
import { TaskFilter } from 'app/database/shared/task/task.filter';
import { OrderRepository } from './order.respository';

export class LocalTaskRepository extends OrderRepository<Task>{

  constructor(table: Dexie.Table<Task, number>){
    super(table, "projectID");
  }

  public findById(id: number): Promise<Task>{
    return this.table.get(id);
  }

  public findByName(name: string): Promise<Task[]>{
    return this.table.where("name").startsWithIgnoreCase(name).toArray();
  }

  // TODO: można wstawić wyszukiwanie po nazwie, albo można dodać nazwę do filtrów

  public findByFilter(filter: TaskFilter): Promise<Task[]>{
    let taskFilter = new TaskRepositoryFilter(filter);
    return this.table.filter(task=>taskFilter.apply(task)).toArray();
  }

  public findByProject(projectId: number): Promise<Task[]>{
    return this.table.where("projectID").equals(projectId).toArray();
  }

  public findAll():Promise<Task[]>{
    return this.table.toArray();
  }

  // TODO: jakoś ogarnąć znajdź pierwsze i ostatnie zadanie z określonym statusem

  public insert(task: Task): Promise<number>{
    let preparedTask = this.getPreparedTask(task);
    return this.table.add(preparedTask);
  }

  public remove(task: Task): Promise<void>{
    return this.table.delete(task.getId());
  }

  public update(task:Task):Promise<number>{
    let preparedTask = this.getPreparedTask(task);
    return this.table.update(task.getId(), preparedTask);
  }

  private getPreparedTask(task: Task): Task{
    let newTask = new Task(task.getName(), task.getDescription(), task.getStatus());
    if(task.getId()){
        newTask.setId(task.getId());
    }
    newTask.setImportant(task.isImportant());
    newTask.setDate(task.getDate());
    newTask.setStartTime(task.getStartTime());
    newTask.setEndDate(task.getEndDate());
    newTask.setPlannedTime(task.getPlannedTime());
    newTask.setProgress(task.getProgress());
    newTask.setProjectID(task.getProjectID());
    newTask.setPriority(task.getPriority());
    newTask.setProjectStageID(task.getProjectStageID());
    newTask.setSuccessorId(task.getSuccessorId());
    newTask.setPosition(task.getPosition());
    return newTask;
  }
}
