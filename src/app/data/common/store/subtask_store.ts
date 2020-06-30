import { ISubtaskRepository } from '../repositories/subtask_repository';
import { Subtask } from 'app/models/subtask';

export class SubtaskStore{

    private subtaskRepository: ISubtaskRepository;

    constructor(subtaskRepository: ISubtaskRepository){
        this.subtaskRepository = subtaskRepository;
    }

    public getSubtaskById(id:number):Promise<Subtask>{
        return this.subtaskRepository.findSubtaskById(id);
    }

    public getSubtaskByTask(taskId:number):Promise<Subtask[]>{
        return this.subtaskRepository.findSubtasksByTask(taskId);
    }

    public createSubtask(subtask:Subtask):Promise<Subtask>{
        return this.subtaskRepository.insertSubtask(subtask).then(insertedId=>{
            return this.getSubtaskById(insertedId);
        });
    }

    public updateSubtask(subtask:Subtask):Promise<Subtask>{
        return this.subtaskRepository.updateSubtask(subtask).then(()=>{
            return Promise.resolve(subtask);
        });
    }

    public removeSubtask(id: number):Promise<void>{
        return this.subtaskRepository.removeSubtask(id);
    }

    public removeSubtaskFromTask(taskId: number):Promise<void>{
        return this.getSubtaskByTask(taskId).then(subtasks=>{
            let ids = [];
            subtasks.forEach(subtask=>ids.push(subtask.getId()));
            return this.subtaskRepository.bulkRemoveSubtasks(ids);
        })
    }
}