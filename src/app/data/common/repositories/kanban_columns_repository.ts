import { KanbanComponent } from 'app/kanban/kanban.component';
import { KanbanColumn as KanbanColumn } from 'app/models/kanban';
import { IOrderableRepository } from './orderable.repository';

export interface IKanbanColumnsRepository extends IOrderableRepository<KanbanColumn>{
    findById(id: number): Promise<KanbanColumn>;
    findByProject(projectId: number):Promise<KanbanColumn[]>;
    findDefaultColumn(projectId:number): Promise<KanbanColumn>;
    insert(column: KanbanColumn):Promise<number>;
    update(column: KanbanColumn):Promise<number>;
    remove(columnId: number): Promise<void>;
    removeByProject(projectId: number): Promise<void>;
}
