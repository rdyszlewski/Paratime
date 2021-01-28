
import { ILabelService } from 'app/database/shared/label/label.service';
import { ISubtaskService } from 'app/database/shared/subtask/subtask.service';
import { ITaskService } from 'app/database/shared/task/task.service';
import { Position } from 'app/database/shared/models/orderable.item';
import { Status } from 'app/database/shared/models/status';
import { Task } from 'app/database/shared/task/task';
import { TaskFilter } from 'app/database/shared/task/task.filter';
import { LocalKanbanTaskRepository } from '../kanban-task/local.kanban-task';
import { LocalTaskRepository } from './local.task.repository';
import { LocalTaskDataService } from './local.task-data.service';
import { LocalKanbanColumnRepository } from '../kanban-column/local.kanban-column.repository';
import { DexieTaskDTO } from './local.task';

export class LocalTaskService extends LocalTaskDataService implements ITaskService{

  constructor(private repository: LocalTaskRepository, kanbanTaskRepository: LocalKanbanTaskRepository,
     kanbanColumnRepository: LocalKanbanColumnRepository,
     subtaskService: ISubtaskService,
     labelService: ILabelService){
      super(repository, kanbanTaskRepository, kanbanColumnRepository, subtaskService, labelService)
  }

  public getById(id: number): Promise<Task> {
    return this.repository.findById(id).then(task=>{
      return this.fetchTask(task);
    });
  }

  public getByName(name: string): Promise<Task[]> {
    return this.repository.findByName(name).then(tasks=>{
      // let mappedTasks = this.mapToTasks(tasks);
      return this.fetchManyTasks(tasks);
    });
  }

  private mapToTasksPromise(tasks: Promise<DexieTaskDTO[]>): Promise<Task[]>{
    return tasks.then(elements=>{
      let tasks = elements.map(x=>x.getModel());
      return Promise.resolve(tasks);
    });
  }

  private fetchManyTasks(tasks: DexieTaskDTO[]): Promise<Task[]>{
    return Promise.all(tasks.map(task=>this.fetchTask(task)));
  }

  public getByFilter(filter: TaskFilter): Promise<Task[]> {
    console.log("GetByFilter");
    console.log(filter);
    return this.repository.findByFilter(filter).then(tasks=>{
      console.log("Wynik");
      console.log(tasks);
      // let mappedTasks = this.mapToTasks(tasks);
      return this.fetchManyTasks(tasks);
    })
  }

  public getByProject(projectId: number): Promise<Task[]>{
    return this.repository.findByProject(projectId).then(tasks=>{
      // let mappedTasks = this.mapToTasks(tasks);
      console.log("Pobrane elementy");
      console.log(tasks);
      return this.fetchManyTasks(tasks);
    })
  }

  public getAll(): Promise<Task[]>{
    // without fetching
    let promise = this.repository.findAll();
    return this.mapToTasksPromise(promise);
  }

  public update(task: Task): Promise<Task> {
    return this.repository.findById(task.id).then(taskDTO=>{
      return this.repository.update(taskDTO).then(_=>{
        return Promise.resolve(task);
      })
    });
  }

  public changeStatus(task: Task, status: Status): Promise<Task[]> {
    // TODO: czy dla każdego stanu jest oddzielna kolejność?
    // TODO: zaplanować, w jaki inny sposób można zrobić kolejność, jeżeli mamy zakończone zadania
    // TODO: refaktoryzacja

    // TODO: sprawdzić jak to działą
    let updated = new Set<DexieTaskDTO>();
    let taskDTO = new DexieTaskDTO(task);
    updated.add(taskDTO);
    // TODO: sprawdzić, czy to będzie działało poprawnie
    return this.taskOrderController.remove(taskDTO).then(updatedItems=>{
      updatedItems.forEach(item=>updated.add(item));
      let filter = TaskFilter.getBuilder().setProject(task.projectID).setFirst(true).setStatus(status).build();
      return this.repository.findByFilter(filter).then(tasks=>{
        if(tasks.length>0){
          let firstTask = tasks[0];
          task.status = status;
          task.position = Position.HEAD;
          // TODO: sprawdzić to, dlaczego tutaj przyjmowane są takie typy
          return this.taskOrderController.insert(taskDTO, firstTask, task.containerId).then(updatedItems=>{
            updatedItems.forEach(item=>updated.add(item));
            let updatedProjects = [];
            updated.forEach(x=>updatedProjects.push(x.getModel()));
            return Promise.resolve(Array.from(updatedProjects));
          });
        }
        return Promise.resolve(Array.from(updated));
      })
    })
  }

  // TODO: spróbować napisać tę metodą jakos lepiej
  public changeProject(currentTask: Task, previousTask: Task, projectId: number): Promise<Task[]> {
    let promises = [
      this.repository.findById(currentTask.id),
      this.repository.findById(previousTask.id)
    ];
    return Promise.all(promises).then(tasks=>{
      let changeContainerAction =  this.taskOrderController.changeContainer(tasks[1], tasks[0], projectId);
      return this.mapToTasksPromise(changeContainerAction);
    });
  }

  public changeOrder(currentTask: Task, previousTask: Task, currentIndex: number, previousIndex: number): Promise<Task[]> {
    let promises = [
      this.repository.findById(currentTask.id),
      this.repository.findById(previousTask.id)
    ];
    return Promise.all(promises).then(tasks=>{
      let changeOrderAction = this.taskOrderController.move(tasks[0], tasks[1], previousIndex, currentIndex);
      return this.mapToTasksPromise(changeOrderAction);
    })
  }
}
