import { Task } from 'app/database/data/models/task';
import { KanbanTask } from 'app/database/data/models/kanban';

export class InsertTaskResult{

    private _insertedTask: Task;
    private _updatedTasks: Task[] = [];
    private _insertedKanbanTask: KanbanTask;
    private _updatedKanbanTasks: KanbanTask[] = [];

    public get insertedTask():Task{
        return this._insertedTask;
    }

    public set insertedTask(task:Task){
        this._insertedTask = task;
    }

    public get updatedTasks(){
        return this._updatedTasks
    };
    public set updatedTasks(tasks: Task[]){
        this._updatedTasks = tasks
    };

    public get insertedKanbanTask(){
        return this._insertedKanbanTask
    };

    public set insertedKanbanTask(task: KanbanTask){
        this._insertedKanbanTask = task
    };
    public get updatedKanbanTasks(){
        return this._updatedKanbanTasks
    };

    public set updatedKanbanTasks(tasks){
        this._updatedKanbanTasks = tasks;
    }
}
