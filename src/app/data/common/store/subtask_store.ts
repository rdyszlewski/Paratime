import { ISubtaskRepository } from '../repositories/subtask_repository';
import { Subtask } from 'app/data/models/subtask';
import { IOrderableStore } from './orderable.store';
import { StoreOrderController } from '../order/order.controller';
import { InsertSubtaskResult } from '../models/insert.subtask.result';

export class SubtaskStore implements IOrderableStore<Subtask>{

    private subtaskRepository: ISubtaskRepository;
    private orderController: StoreOrderController<Subtask>;

    constructor(subtaskRepository: ISubtaskRepository){
        this.subtaskRepository = subtaskRepository;
        this.orderController  = new StoreOrderController(this.subtaskRepository);
    }

    public getSubtaskById(id:number):Promise<Subtask>{
        return this.subtaskRepository.findById(id);
    }

    public getSubtaskByTask(taskId:number):Promise<Subtask[]>{
        return this.subtaskRepository.findByTask(taskId);
    }

    public createSubtask(subtask:Subtask):Promise<InsertSubtaskResult>{
        return this.subtaskRepository.insert(subtask).then(insertedId=>{
            return this.getSubtaskById(insertedId).then(subtask=>{
              return this.orderController.insert(subtask, null, subtask.getContainerId()).then(updatedSubtask=>{
                const result = new InsertSubtaskResult();
                result.insertedSubtask = subtask;
                result.updatedSubstask = updatedSubtask;
                return Promise.resolve(result);
              });
            });
        });
    }

    public updateSubtask(subtask:Subtask):Promise<Subtask>{
        return this.subtaskRepository.update(subtask).then(()=>{
            return Promise.resolve(subtask);
        });
    }

    public removeSubtask(id: number):Promise<Subtask[]>{
      return this.subtaskRepository.findById(id).then(subtask=>{
        return this.subtaskRepository.remove(id).then(()=>{
          return this.orderController.remove(subtask);
        });
      })
    }

    public removeSubtaskFromTask(taskId: number):Promise<void>{
        return this.getSubtaskByTask(taskId).then(subtasks=>{
            let ids = [];
            subtasks.forEach(subtask=>ids.push(subtask.getId()));
            return this.subtaskRepository.bulkRemove(ids);
        })
    }

    public move(previousItem: Subtask, currentItem: Subtask, moveUp: boolean): Promise<Subtask[]> {
      return this.orderController.move(previousItem, currentItem, moveUp);
    }

    public changeContainer(item: Subtask, currentTask: Subtask, currentContainerId: number): Promise<Subtask[]> {
      return this.orderController.changeContainer(item, currentTask, currentContainerId);
    }

}
