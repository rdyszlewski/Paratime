import { Subtask } from 'app/data/models/subtask';
import { IOrderableRepository } from './orderable.repository';

export interface ISubtaskRepository extends IOrderableRepository<Subtask>{
    findById(id: number):Promise<Subtask>;
    findByTask(taskId:number):Promise<Subtask[]>;
    insert(subtask:Subtask):Promise<number>;
    update(subtask:Subtask):Promise<number>;
    remove(id: number):Promise<void>;
    bulkRemove(ids: number[]):Promise<void>;
}
