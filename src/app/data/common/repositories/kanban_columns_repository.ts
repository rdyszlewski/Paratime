import { KanbanComponent } from 'app/kanban/kanban.component';
import { KanbanColumn as KanbanColumn } from 'app/models/kanban';

export interface IKanbanColumnsRepository{
    findColumnById(id: number): Promise<KanbanColumn>;
    findColumnsByProject(projectId: number):Promise<KanbanColumn[]>;
    findDefaultColumn(projectId:number): Promise<KanbanColumn>;
    insertColumn(column: KanbanColumn):Promise<number>;
    updateColumn(column: KanbanColumn):Promise<number>;
    removeColumn(columnId: number): Promise<void>;
    removeColumnsByProject(projectId: number): Promise<void>;
}