import { InsertResult } from 'app/database/shared/insert-result';
import { Subtask } from 'app/database/shared/subtask/subtask';
import { ISubtaskService } from 'app/database/shared/subtask/subtask.service';
import { LocalOrderController } from '../order/local.orderable.service';
import { DexieSubtaskDTO } from './local.subtask';
import { LocalSubtaskRepository, SubtaskDTO } from './local.subtask.repository';

export class LocalSubtaskService implements ISubtaskService{

  private orderController: LocalOrderController<SubtaskDTO>;

  constructor(private repository: LocalSubtaskRepository){
    this.orderController = new LocalOrderController(repository);
  }

  public getById(id: number): Promise<Subtask> {
    let action = this.repository.findById(id);
    return this.mapToSubtaskAction(action);
  }

  private mapToSubtaskAction(action: Promise<SubtaskDTO>): Promise<Subtask>{
    return action.then(result=>{
      return Promise.resolve(result.getModel());
    });
  }

  public getByTask(taskId: number): Promise<Subtask[]> {
    let action =  this.repository.findByTaskId(taskId);
    return this.mapToSubtasksListAction(action);
  }

  private mapToSubtasksListAction(action: Promise<SubtaskDTO[]>): Promise<Subtask[]>{
    return action.then(results=>{
      return Promise.resolve(results.map(x=>x.getModel()));
    });
  }

  public create(subtask: Subtask): Promise<InsertResult<Subtask>> {
    let subtaskDTO = new DexieSubtaskDTO(subtask);
    return this.insertSubtask(subtaskDTO).then(insertedSubtask=>{
      return this.orderController.insert(insertedSubtask, null, insertedSubtask.containerId).then(updatedSubtasks=>{
        return Promise.resolve(new InsertResult(insertedSubtask.getModel(), updatedSubtasks.map(x=>x.getModel())));
      });
    });
  }

  private insertSubtask(subtask: SubtaskDTO): Promise<SubtaskDTO> {
    return this.repository.insert(subtask).then(insertedId=>{
      return this.repository.findById(insertedId);
    });
  }

  public remove(subtask: Subtask): Promise<Subtask[]> {
    return this.removeById(subtask.id);
  }

  private removeById(id: number): Promise<Subtask[]> {
    return this.repository.findById(id).then(subtaskDTO=>{
      return this.repository.remove(id).then(()=>{
        let action = this.orderController.remove(subtaskDTO);
        return this.mapToSubtasksListAction(action);
      });
    });
  }

  public removeByTask(taskId: number): Promise<void> {
    return this.repository.findByTaskId(taskId).then(subtasks=>{
      let actions = subtasks.map(subtask=>this.removeById(subtask.id));
      return Promise.all(actions).then(()=>{
        return Promise.resolve(null);
      });
    })
  }

  public update(subtask: Subtask): Promise<Subtask> {
    return this.repository.findById(subtask.id).then(subtaskDTO=>{
      subtaskDTO.update(subtask);
      return this.repository.update(subtaskDTO).then(_=>{
        return Promise.resolve(subtask);
      });
    });
  }

  public changeOrder(currentSubtask: Subtask, previousSubtask: Subtask, currentIndex: number, previousIndex: number) {
    let actions = [
      this.repository.findById(currentSubtask.id),
      this.repository.findById(previousSubtask.id)
    ]
    return Promise.all(actions).then(results=>{
      return this.orderController.move(results[0], results[1], currentIndex, previousIndex);
    });
  }
}
