import { ITagRepository } from '../../common/repositories/tag_repository';
import { Tag } from 'app/models/tag';

export class LocalTagRepository implements ITagRepository{

    private table: Dexie.Table<Tag, number>;

    constructor(table: Dexie.Table<Tag, number>){
        this.table = table;
    }
    
    public findTagById(id: number): Promise<Tag> {
        return this.table.where('id').equals(id).first();
    }

    public findTagByName(name: string): Promise<Tag> {
        return this.table.where('name').equals(name).first();
    }

    public insertTag(tag: Tag): Promise<number> {
        return this.table.add(tag);
    }

    public updateTag(tag: Tag): Promise<number> {
        return this.table.update(tag.getId(), tag);
    }

    public removeTag(id: number): Promise<void> {
        return this.table.delete(id);
    }

    public removeTagByName(name: string): Promise<void> {
        return this.table.where('name').equals(name).delete().then(number=>{
            return Promise.resolve();
        });
    }

}