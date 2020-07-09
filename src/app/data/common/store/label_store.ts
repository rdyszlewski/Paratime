import { ITaskLabelsRepository } from '../repositories/task_labels_repository';
import { ILabelRepository } from '../repositories/label_repository';
import { Label } from 'app/models/label';
import { TaskLabelsModel } from '../models';

export class LabelStore{

    private labelRepository: ILabelRepository;
    private taskLabelsRepository: ITaskLabelsRepository;

    constructor(labelRepository:ILabelRepository, taskLabelsRepository: ITaskLabelsRepository){
        this.labelRepository = labelRepository;
        this.taskLabelsRepository = taskLabelsRepository;
    }

    public getLabelById(id:number):Promise<Label>{
        return this.labelRepository.findLabelById(id);
    }

    public getLabelByName(name:string):Promise<Label>{
        return this.labelRepository.findLabelByName(name);
    }

    public getAllLabel():Promise<Label[]>{
        return this.labelRepository.findAllLabels();
    }

    public createLabel(label:Label):Promise<Label>{
        return this.labelRepository.insertLabel(label).then(insertedId=>{
            return this.getLabelById(insertedId);
        });
    }

    public connectTaskAndLabel(taskId: number, labelId:number):Promise<TaskLabelsModel>{
        return this.taskLabelsRepository.insert(new TaskLabelsModel(taskId, labelId));
    }

    public updateLabel(label:Label):Promise<Label>{
        // TODO: sprawdzić, czy nie będzie trzeba zmienić wyniku po then
        return this.labelRepository.updateLabel(label).then(()=>{
            return Promise.resolve(label);
        });
    }

    public removeLabel(labelId):Promise<void>{
        // TODO: sprawdzić, czy działa poprawnie
        return this.taskLabelsRepository.removeByLabelId(labelId).then(()=>{
            return this.labelRepository.removeLabel(labelId);
        });
    }

    public getLabelsByTask(taskId):Promise<Label[]>{
        return this.taskLabelsRepository.findByTaskId(taskId).then(entries=>{
            let promises = [];
            entries.forEach(entry=>{
                let promise = this.labelRepository.findLabelById(entry.getLabelId());
                promises.push(promise);
            });
            return Promise.all(promises);
        })
    }

    public removeTaskLabels(taskId:number):Promise<void>{
        return this.taskLabelsRepository.removeByTaskId(taskId);
    }

    public removeLabelFromTask(taskId: number, labelId: number):Promise<void>{
        return this.taskLabelsRepository.remove(new TaskLabelsModel(taskId, labelId));
    }

}