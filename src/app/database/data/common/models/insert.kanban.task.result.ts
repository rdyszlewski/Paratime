import { KanbanTask } from 'app/database/data/models/kanban';

export class InsertKanbanTaskResult{

    private _insertedKanbanTask: KanbanTask;
    private _updatedKanbanTask: KanbanTask[] = [];

    public get insertedKanbanTask():KanbanTask{
        return this._insertedKanbanTask;
    }

    public set insertedKanbanTask(task: KanbanTask){
        this._insertedKanbanTask = task;
    }

    public get updatedKanbanTask():KanbanTask[]{
        return this._updatedKanbanTask;
    }

    public set updatedKanbanTask(tasks: KanbanTask[]){
        this._updatedKanbanTask = tasks;
    }
}
