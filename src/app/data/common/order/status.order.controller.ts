import { Task } from 'app/data/models/task';
import { StoreOrderController } from './order.controller';
import { ITaskRepository } from '../repositories/task_repository';

export class StatusStoreOrderController  extends StoreOrderController<Task>{

  private taskRepository: ITaskRepository;

  constructor(repository: ITaskRepository){
    super(repository);
    this.taskRepository = repository;
  }

  // stworzono, ponieważ w standardowy sposób nie działało kończenie zadań, ponieważ wyszukiwało ostatni element bez ograniczenia stanu zadania
  protected getLast(item: Task, containerId: number): Promise<Task>{
    if(item.getStatus()){
      return this.taskRepository.findLastTaskWithStatus(containerId, item.getStatus(), item.getId());
    } else {
      return this.taskRepository.findLast(containerId, item.getId());
    }
  }
}
