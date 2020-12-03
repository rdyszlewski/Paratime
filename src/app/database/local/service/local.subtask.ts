import { ISubtaskService } from 'app/database/common/subtask.service';
import { Subtask } from 'app/database/data/models/subtask';
import { InsertResult } from 'app/database/model/insert-result';
import { LocalSubtaskRepository } from '../repository/local.subtask.repository';
import { LocalOrderController } from './local.orderable.service';

export class LocalSubtaskService implements ISubtaskService{

  private orderController: LocalOrderController<Subtask>;

  constructor(private repository: LocalSubtaskRepository){
    this.orderController = new LocalOrderController(repository);
  }

  public getById(id: number): Promise<Subtask> {
    return this.repository.findById(id);
  }

  public getByTask(taskId: number): Promise<Subtask[]> {
    return this.repository.findByTaskId(taskId);
  }

  public create(subtask: Subtask): Promise<InsertResult<Subtask>> {
    return this.insertSubtask(subtask).then(insertedSubtask=>{
      return this.orderController.insert(insertedSubtask, null, insertedSubtask.getContainerId()).then(updatedSubtasks=>{
        return Promise.resolve(new InsertResult(insertedSubtask, updatedSubtasks));
      })
    })
  }

  private insertSubtask(subtask: Subtask): Promise<Subtask>{
    return this.repository.insert(subtask).then(insertedId=>{
      return this.repository.findById(insertedId);
    })
  }

  public remove(subtask: Subtask): Promise<Subtask[]> {
    return this.repository.remove(subtask).then(()=>{
      return this.orderController.remove(subtask);
    })
  }

  public removeByTask(taskId: number): Promise<void> {
    return this.repository.findByTaskId(taskId).then(subtasks=>{
      let actions = subtasks.map(subtask=>this.remove(subtask));
      return Promise.all(actions).then(()=>{
        return Promise.resolve(null);
      });
    })
  }

  public update(subtask: Subtask): Promise<Subtask> {
    return this.repository.update(subtask).then(_=>{
      return Promise.resolve(subtask);
    })
  }

  public changeOrder(currentSubtask: Subtask, previousSubtask: Subtask, currentIndex: number, previousIndex: number) {
    return this.orderController.move(currentSubtask, previousSubtask, currentIndex, previousIndex);
  }
}
