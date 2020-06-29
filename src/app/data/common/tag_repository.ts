import { Tag } from 'app/models/tag';

export interface ITagRepository{
    findTagById(id: number):Promise<Tag>;
    findTagByName(name: string):Promise<Tag>;
    insertTag(tag: Tag): Promise<Tag>;
    updateTag(tag: Tag): Promise<Tag>;
    removeTag(id: number): Promise<void>;
    removeTagByName(name:string):Promise<void>;
}