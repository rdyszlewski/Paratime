import { InsertResult } from '../insert-result';
import { KanbanColumn } from './kanban-column';

export interface IKanbanColumnService{
  getById(id: number): Promise<KanbanColumn>;
  getByProjectId(projectId: number): Promise<KanbanColumn[]>;
  getDefaultColumn(projectId: number): Promise<KanbanColumn>;
  create(column:KanbanColumn):Promise<InsertResult<KanbanColumn>>;
  /// remove column, and all tasks in it
  remove(column:KanbanColumn):Promise<KanbanColumn[]>;
  update(column:KanbanColumn):Promise<KanbanColumn>;
  removeByProject(projectId: number):Promise<void>;
  changeOrder(currentColumn: KanbanColumn, previousColumn: KanbanColumn, currentIndex: number, previousIndex: number);
}
