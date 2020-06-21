import { ITagRepository } from '../common/tag_repository';
import { Tag } from 'app/models/tag';
import { LocalDatabase } from './database';

export class LocalTagRepository implements ITagRepository{
    
    private database: LocalDatabase;

    constructor(database:LocalDatabase){
        this.database = database;
    }
    
    findTagById(id: number): Tag {
        throw new Error("Method not implemented.");
    }
    findTagByName(name: string): Tag {
        throw new Error("Method not implemented.");
    }
    insertTag(tag: Tag): Tag {
        throw new Error("Method not implemented.");
    }
    updateTag(tag: Tag): Tag {
        throw new Error("Method not implemented.");
    }
    removeTag(id: number): void {
        throw new Error("Method not implemented.");
    }
    removeTagByName(name: string): void {
        throw new Error("Method not implemented.");
    }

}