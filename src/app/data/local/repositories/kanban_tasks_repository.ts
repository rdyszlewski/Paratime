import { IKanbanTasksRepository } from 'app/data/common/repositories/kanban_tasks_repository';
import { KanbanTask } from 'app/models/kanban';

export class LocalKanbanTasksRepository implements IKanbanTasksRepository{

    private table: Dexie.Table<KanbanTask, number>;

    constructor(table: Dexie.Table<KanbanTask, number>){
        this.table = table;
    }

    public findTaskById(id: number): Promise<KanbanTask>{
        return this.table.get(id);
    }

    public findTasksByTaskId(taskId: number): Promise<KanbanTask> {
        return this.table.where("taskId").equals(taskId).first();
    }

    public findTasksByColumn(columnId: number): Promise<KanbanTask[]> {
        return this.table.where("columnId").equals(columnId).toArray();
    }

    public findLastTask(columnId: number): Promise<KanbanTask> {
        return this.table.where({"columnId": columnId, "nextColumnId": null}).first();
    }

    public findFirstTask(columnId: number): Promise<KanbanTask> {
        return this.table.where({"columnId":columnId, "prevColumnId": null}).first();
    }

    public insertTask(task: KanbanTask): Promise<number> {
        return this.table.add(task);
    }

    public updateTask(task: KanbanTask): Promise<number> {
        return this.table.update(task.getId(), task);
    }

    public removeTask(taskId: any): Promise<void> {
        return this.table.delete(taskId);
    }

    public removeTasksByColumn(columnId: number): Promise<void> {
        return this.findTasksByColumn(columnId).then(results=>{
            return results.forEach(column=>{
                this.table.delete(column.getId());
            });
        });
    }
}