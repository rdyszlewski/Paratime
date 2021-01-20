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
    return this.table.delete(task.id);
  }

  public update(task:Task):Promise<number>{
    let preparedTask = this.getPreparedTask(task);
    return this.table.update(task.id, preparedTask);
  }

  private getPreparedTask(task: Task): Task{
    // TODO: uzupełnić to
    return task;

    // let newTask = new Task(task.name(), task.description(), task.status());
    // if(task.getId()){
    //     newTask.setId(task.getId());
    // }
    // newTask.important(task.important());
    // newTask.date(task.date());
    // newTask.startTime(task.startTime());
    // newTask.endDate(task.endDate());
    // newTask.plannedTime(task.plannedTime());
    // newTask.progress(task.progress());
    // newTask.projectID(task.projectID());
    // newTask.priority(task.priority());
    // newTask.projectStageID(task.projectStageID());
    // newTask.setSuccessorId(task.getSuccessorId());
    // newTask.setPosition(task.getPosition());
    // return newTask;
  }
}
