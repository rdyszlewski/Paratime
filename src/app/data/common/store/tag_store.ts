import { ITaskTagsRepository } from '../repositories/task_tags_repository';
import { ITagRepository } from '../repositories/tag_repository';
import { Tag } from 'app/models/tag';
import { TaskTagsModel } from '../models';

export class TagStore{

    private tagRepository: ITagRepository;
    private taskTagRepository: ITaskTagsRepository;

    constructor(tagRepository:ITagRepository, taskTagRepository: ITaskTagsRepository){
        this.tagRepository = tagRepository;
        this.taskTagRepository = taskTagRepository;
    }

    public getTagById(id:number):Promise<Tag>{
        return this.tagRepository.findTagById(id);
    }

    public getTagByName(name:string):Promise<Tag>{
        return this.tagRepository.findTagByName(name);
    }

    public getAllTags():Promise<Tag[]>{
        return this.tagRepository.findAllTags();
    }

    public createTag(tag:Tag):Promise<Tag>{
        return this.tagRepository.insertTag(tag).then(insertedId=>{
            return this.getTagById(insertedId);
        });
    }

    public connectTaskAndTag(taskId: number, tagId:number):Promise<TaskTagsModel>{
        return this.taskTagRepository.insert(new TaskTagsModel(taskId, tagId));
    }

    public updateTag(tag:Tag):Promise<Tag>{
        // TODO: sprawdzić, czy nie będzie trzeba zmienić wyniku po then
        return this.tagRepository.updateTag(tag).then(()=>{
            return Promise.resolve(tag);
        });
    }

    public removeTag(tagId):Promise<void>{
        // TODO: sprawdzić, czy działa poprawnie
        return this.taskTagRepository.removeByTagId(tagId).then(()=>{
            return this.tagRepository.removeTag(tagId);
        });
    }

    public getTagsByTask(taskId):Promise<Tag[]>{
        return this.taskTagRepository.findByTaskId(taskId).then(entries=>{
            let promises = [];
            entries.forEach(entry=>{
                let promise = this.tagRepository.findTagById(entry.getTagId());
                promises.push(promise);
            });
            return Promise.all(promises);
        })
    }

    public removeTaskTags(taskId:number):Promise<void>{
        return this.taskTagRepository.removeByTaskId(taskId);
    }

    public removeTagFromTask(taskId: number, tagId: number):Promise<void>{
        return this.taskTagRepository.remove(new TaskTagsModel(taskId, tagId));
    }

}