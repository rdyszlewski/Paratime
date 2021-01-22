import { Task } from 'app/database/shared/task/task';
import { TaskRepositoryFilter } from 'app/database/local/task/local.task.filter';
import { TaskFilter } from 'app/database/shared/task/task.filter';
import { DexieTaskDTO } from './local.task';
import { OrderDTORepository } from './order.repository.dto';
import { IOrderRepository } from './order.respository';

export class LocalTaskRepository extends OrderDTORepository<Task, DexieTaskDTO> implements IOrderRepository<Task>{

  constructor(table: Dexie.Table<DexieTaskDTO, number>){
    super(table, "projectID");
  }

  public findById(id: number): Promise<Task>{
    return this.table.get(id).then(task=>{
      return Promise.resolve(task.getModel());
    })
  }

  public findByName(name: string): Promise<Task[]>{
    let dexiePromise = this.table.where("name").startsWithIgnoreCase(name).toArray();
    return this.mapToTasks(dexiePromise);
  }

  private mapToTasks(dexieTasksPromise: Promise<DexieTaskDTO[]>): Promise<Task[]>{
    return dexieTasksPromise.then(dexieTasks=>{
      let tasks = dexieTasks.map(x=>x.getModel());
      return Promise.resolve(tasks);
    })
  }

  // TODO: można wstawić wyszukiwanie po nazwie, albo można dodać nazwę do filtrów

  public findByFilter(filter: TaskFilter): Promise<Task[]>{
    let taskFilter = new TaskRepositoryFilter(filter);
    // TODO: sprawdzić z tym filrem
    let dexiePromise = this.table.filter(task=>taskFilter.apply(task.getModel())).toArray()
    return this.mapToTasks(dexiePromise);
  }

  public findByProject(projectId: number): Promise<Task[]>{
    let dexiePromise = this.table.where("projectID").equals(projectId).toArray();
    return this.mapToTasks(dexiePromise);
  }

  public findAll():Promise<Task[]>{
    let dexiePromise = this.table.toArray();
    return this.mapToTasks(dexiePromise);
  }

  // TODO: jakoś ogarnąć znajdź pierwsze i ostatnie zadanie z określonym statusem

  public insert(task: Task): Promise<number>{
    // let preparedTask = this.getPreparedTask(task);
    return this.table.add(new DexieTaskDTO(task));
  }

  public remove(task: Task): Promise<void>{
    return this.table.delete(task.id);
  }

  public update(task:Task):Promise<number>{
    // let preparedTask = this.getPreparedTask(task);
    return this.table.update(task.id, new DexieTaskDTO(task));
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
