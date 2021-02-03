import { KanbanTask } from "app/database/shared/kanban-task/kanban-task";
import { OrderableItem } from "app/database/shared/models/orderable.item";
import { LocalDTO } from "../task/local.dto";

export class DexieKanbanTaskDTO extends OrderableItem implements LocalDTO<KanbanTask>{

  public taskId: number;
  public columnId: number;

  // TODO: sprawdzić, jak wygląda sprawa z id. Jest tutaj raczej niepotrzebne


  constructor(kanbanTask: KanbanTask=null){
    super();
    if(kanbanTask){
      this.update(kanbanTask);
    }
  }

  public getModel(): KanbanTask {
    let task = new KanbanTask();
    task.id = this.taskId;
    task.columnId = this.columnId;

    return task;
  }

  public update(task: KanbanTask) {
    this.taskId = task.task.id;
    this.columnId = task.columnId;
  }

  public get containerId(): number {
    return this.columnId;
  }
  public set containerId(id: number) {
    this.columnId = id;
  }
}
