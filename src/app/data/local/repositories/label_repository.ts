import { ILabelRepository } from '../../common/repositories/label_repository';
import { Label } from 'app/models/label';

export class LocalLabelRepository implements ILabelRepository{

    private table: Dexie.Table<Label, number>;

    constructor(table: Dexie.Table<Label, number>){
        this.table = table;
    }
    
    public findLabelById(id: number): Promise<Label> {
        return this.table.where('id').equals(id).first();
    }

    public findAllLabels():Promise<Label[]>{
        return this.table.toArray();
    }

    public findLabelByName(name: string): Promise<Label> {
        return this.table.where('name').equals(name).first();
    }

    public insertLabel(label: Label): Promise<number> {
        return this.table.add(label);
    }

    public updateLabel(label: Label): Promise<number> {
        return this.table.update(label.getId(), label);
    }

    public removeLabel(id: number): Promise<void> {
        return this.table.delete(id);
    }

    public removeLabelByName(name: string): Promise<void> {
        return this.table.where('name').equals(name).delete().then(number=>{
            return Promise.resolve();
        });
    }

}