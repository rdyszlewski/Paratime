import { Task } from 'app/database/data/models/task';
import { KanbanColumn } from 'app/database/data/models/kanban';
import { NumberFormatStyle } from '@angular/common';

export class InsertTaskData{

    private _task:Task;
    private _column:KanbanColumn;
    private _projectId:number;

    constructor(task:Task, column: KanbanColumn = null, projectId:number = null){
        this._task = task;
        this._column = column;
        this._projectId = projectId;
    }

    public get task():Task{
        return this._task;
    }

    public set task(task: Task){
        this._task = task;
    }

    public get column():KanbanColumn{
        return this._column;
    }

    public set column(column){
        this._column = column;
    }

    public get projectId():number{
        return this._projectId;
    }

    public set projectId(id: number){
        this._projectId = id;
    }

}
