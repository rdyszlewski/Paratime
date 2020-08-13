import { Label } from 'app/models/label';
import { IOrderableRepository } from './orderable.repository';

export interface ILabelRepository extends IOrderableRepository<Label>{
    findById(id: number):Promise<Label>;
    findByName(name: string):Promise<Label>;
    findAll():Promise<Label[]>;
    insert(label: Label): Promise<number>;
    update(label: Label): Promise<number>;
    remove(id: number): Promise<void>;
    removeByName(name:string):Promise<void>;
}
