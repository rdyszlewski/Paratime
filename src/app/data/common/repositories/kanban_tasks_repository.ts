import { KanbanTask } from 'app/models/kanban';

export interface IKanbanTasksRepository{
    findTasksByTaskId(taskId: number): Promise<KanbanTask>;
    findTaskById(id:number): Promise<KanbanTask>;
    findTasksByColumn(columnId: number):Promise<KanbanTask[]>;
    findLastTask(columnId: number): Promise<KanbanTask>;
    findFirstTask(columnId: number): Promise<KanbanTask>;
    insertTask(task: KanbanTask): Promise<number>;
    updateTask(task:KanbanTask): Promise<number>;
    removeTask(taskId):Promise<void>;
    removeTasksByColumn(columnId:number):Promise<void>
}