import { Tag } from 'app/models/tag';

export interface ITagRepository{
    findTagById(id: number):Promise<Tag>;
    findTagByName(name: string):Promise<Tag>;
    findAllTags():Promise<Tag[]>;
    insertTag(tag: Tag): Promise<number>;
    updateTag(tag: Tag): Promise<number>;
    removeTag(id: number): Promise<void>;
    removeTagByName(name:string):Promise<void>;
}