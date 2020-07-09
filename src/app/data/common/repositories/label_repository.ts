import { Label } from 'app/models/label';

export interface ILabelRepository{
    findLabelById(id: number):Promise<Label>;
    findLabelByName(name: string):Promise<Label>;
    findAllLabels():Promise<Label[]>;
    insertLabel(label: Label): Promise<number>;
    updateLabel(label: Label): Promise<number>;
    removeLabel(id: number): Promise<void>;
    removeLabelByName(name:string):Promise<void>;
}