import { KanbanColumn } from "app/database/shared/kanban-column/kanban-column";
import { OrderableItem } from "app/database/shared/models/orderable.item";
import { LocalDTO } from "../task/local.dto";

export class DexieKanbanColumnDTO extends OrderableItem implements LocalDTO<KanbanColumn> {
  public projectId: number;
  public name: string;
  public default: number;

  constructor(column: KanbanColumn) {
    super();
    this.update(column);
  }

  public getModel(): KanbanColumn {
    let column = new KanbanColumn();
    column.id = this._id;
    column.projectId = this.projectId;
    column.name = this.name;
    column.default = this.default == 1 ? true : false;
    return column;
  }

  public update(column: KanbanColumn) {
    this.id = column.id;
    this.projectId = column.projectId;
    this.name = column.name;
    this.default = column.default ? 1 : 0;
  }

  public get containerId(): number {
    return this.projectId;
  }
  public set containerId(id: number) {
    this.projectId = id;
  }
}
