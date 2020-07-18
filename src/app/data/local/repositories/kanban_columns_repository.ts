import { IKanbanColumnsRepository } from 'app/data/common/repositories/kanban_columns_repository';
import { KanbanColumn } from 'app/models/kanban';

export class LocalKanbanColumnsRepository implements IKanbanColumnsRepository{

    private table: Dexie.Table<KanbanColumn, number>;

    constructor(table: Dexie.Table<KanbanColumn, number>){
        this.table = table;
    }
  
    public findColumnById(id: number): Promise<KanbanColumn> {
        return this.table.get(id);
    }

    public findColumnsByProject(projectId: number): Promise<KanbanColumn[]> {
        return this.table.where("projectId").equals(projectId).toArray();
    }

    public findDefaultColumn(projectId: number): Promise<KanbanColumn> {
        return this.table.where({"projectId": projectId, "default": 1}).first();
    }

    public insertColumn(column: KanbanColumn): Promise<number> {
        return this.table.add(column);
    }

    public updateColumn(column: KanbanColumn): Promise<number> {
        return this.table.update(column.getId(), column);
    }

    public removeColumn(columnId: number): Promise<void> {
        return this.table.delete(columnId);
    }

    public removeColumnsByProject(projectId: number): Promise<void> {
        // TODO: sprawdzić, czy to działa
        return this.findColumnsByProject(projectId).then(results=>{
            return results.forEach(column=>{
                this.table.delete(column.getId());
            })
        });
    }

}