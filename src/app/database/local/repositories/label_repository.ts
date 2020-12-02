import { Label } from 'app/database/data/models/label';
import { LocalOrderRepository } from 'app/database/data/common/repositories/orderable.repository';
import { ILabelRepository } from 'app/database/data/common/repositories/label_repository';

export class LocalLabelRepository implements ILabelRepository{

    private table: Dexie.Table<Label, number>;
    private orderRepository: LocalOrderRepository<Label>;

    constructor(table: Dexie.Table<Label, number>){
        this.table = table;
        this.orderRepository = new LocalOrderRepository(this.table, null);
    }

    public findById(id: number): Promise<Label> {
        return this.table.where('id').equals(id).first();
    }

    public findAll():Promise<Label[]>{
        return this.table.toArray();
    }

    public findByName(name: string): Promise<Label> {
        return this.table.where('name').equals(name).first();
    }

    public insert(label: Label): Promise<number> {
        return this.table.add(label);
    }

    public update(label: Label): Promise<number> {
        return this.table.update(label.getId(), label);
    }

    public remove(id: number): Promise<void> {
        return this.table.delete(id);
    }

    public removeByName(name: string): Promise<void> {
        return this.table.where('name').equals(name).delete().then(number=>{
            return Promise.resolve();
        });
    }

    public findBySuccessor(successorId: number): Promise<Label> {
      return this.orderRepository.findBySuccessor(successorId);
    }

    public findFirst(containerId: number): Promise<Label> {
      return this.orderRepository.findFirst(containerId);
    }

    public findLast(containerId: number, exceptItem: number): Promise<Label> {
      return this.orderRepository.findLast(containerId, exceptItem);
    }

}
