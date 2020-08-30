import { KanbanTask } from 'app/data/models/kanban';
import { IOrderableRepository } from './orderable.repository';

export interface IKanbanTasksRepository extends IOrderableRepository<KanbanTask>{
    findTasksByTaskId(taskId: number): Promise<KanbanTask>;
    findById(id:number): Promise<KanbanTask>;
    findTasksByColumn(columnId: number):Promise<KanbanTask[]>;
    insertTask(task: KanbanTask): Promise<number>;
    update(task:KanbanTask): Promise<number>;
    removeTask(taskId):Promise<void>;
    removeTasksByColumn(columnId:number):Promise<void>
}
