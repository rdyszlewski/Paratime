import { LocalKanbanColumnService } from "app/database/local/kanban-column/local.kanban-column.service";
import { Position } from "../models/orderable.item";
import { KanbanColumn } from "./kanban-column";

export class KanbanColumnAdapter{

  public static getColumn(json: JSON): KanbanColumn{
    let column = new KanbanColumn();
    column.setId(json["id"]);
    column.setName(json["name"]);
    column.setProjectId(json["projectId"]);
    column.setDefault(json["isDefault"]);
    
    column.setSuccessorId(json["successor"]);
    column.setPosition(json["head"] == 1? Position.HEAD: Position.NORMAL);

    return column;
  }
}
