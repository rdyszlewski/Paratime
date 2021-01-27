import { KanbanColumn } from "app/database/shared/kanban-column/kanban-column";
import { OrderableItem } from "app/database/shared/models/orderable.item";
import { LocalDTO } from "../task/local.dto";

// export interface IKanbanColumnDTO extends LocalDTO<KanbanColumn>{
//   projectId: number;
//   name: string;
//   default: number;
// }

export class DexieKanbanColumnDTO extends OrderableItem implements LocalDTO<KanbanColumn>{

  public projectId: number;
  public name: string;
  public default: number;

  constructor(column: KanbanColumn){
   super();
   this.id = column.id;
   this.projectId = column.projectId;
   this.name = column.name;
   this.default = column.default ? 1 : 0;
   console.log("Ustawiam default");
   console.log(this.default);;
 }

public getModel(): KanbanColumn{
  let column = new KanbanColumn();
  column.id = this._id;
  column.projectId = this.projectId;
  column.name = this.name;
  column.default = this.default == 1? true: false;
  return column;
 }

   public get containerId(): number {
    return this.projectId;
  }
  public set containerId(id: number) {
    this.projectId = id;
  }

//  private _projectId: number;
//  private _name: string;
//  private _default: number;

//  constructor(column: KanbanColumn){
//    super();
//    this._id = column.id;
//    this._projectId = column.projectId;
//    this._name = column.name;
//    this._default = column.default ? 1 : 0;
//    console.log("Ustawiam default");
//    console.log(this._default);;


//  }

//  public getModel(): KanbanColumn{
//   let column = new KanbanColumn();
//   column.id = this._id;
//   column.projectId = this._projectId;
//   column.name = this._name;
//   column.default = this._default == 1? true: false;
//   return column;
//  }

// 	public get projectId(): number {
// 		return this._projectId;
// 	}

// 	public get name(): string {
// 		return this._name;
// 	}

// 	public get default(): number {
//     console.log("Zwracam default");
//     console.log(this._default);
// 		return this._default;
// 	}

// 	public set projectId(value: number) {
// 		this._projectId = value;
// 	}

// 	public set name(value: string) {
// 		this._name = value;
// 	}

// 	public set default(value: number) {
// 		this._default = value;
//   }

//   public get containerId(): number {
//     return this._projectId;
//   }
//   public set containerId(id: number) {
//     this._projectId = id;
//   }

}
