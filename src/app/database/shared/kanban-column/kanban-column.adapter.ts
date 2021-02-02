import { KanbanColumn } from "./kanban-column";

export class KanbanColumnAdapter{

  public static getColumn(json: JSON): KanbanColumn{
    let column = new KanbanColumn();
    column.id = json["id"];
    column.name = json["name"];
    column.projectId = json["projectId"];
    column.default = json["default"];

    return column;
  }
}
