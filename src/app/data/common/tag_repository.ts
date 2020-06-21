import { Tag } from 'app/models/tag';

export interface ITagRepository{
    findTagById(id: number):Tag;
    findTagByName(name: string):Tag;
    insertTag(tag: Tag): Tag;
    updateTag(tag: Tag): Tag;
    removeTag(id: number): void;
    removeTagByName(name:string):void;
}