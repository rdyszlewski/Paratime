import { OrderRepository } from '../task/order.respository';
import { DexieKanbanColumnDTO } from './local.kanban-column';


export class LocalKanbanColumnRepository extends OrderRepository<DexieKanbanColumnDTO>{

  constructor(table: Dexie.Table<DexieKanbanColumnDTO, number>){
    super(table, "projectId");
  }

  public findById(id: number): Promise<DexieKanbanColumnDTO>{
    return this.table.get(id);
  }

  public findByProjectId(projectId: number): Promise<DexieKanbanColumnDTO[]>{
    return this.table.where("projectId").equals(projectId).toArray();
  }

  public findDefaultColumn(projectId: number): Promise<DexieKanbanColumnDTO>{
    console.log("FindDefaultColumn");
    console.log(projectId);
    this.table.where("default").equals(0).toArray().then(result => {
      console.log("Jakiś wydruk");
      console.log(result);

    });
    return this.table.where({"projectId":projectId, "default":1}).first();
  }

  public insert(column:DexieKanbanColumnDTO):Promise<number>{
    console.log("Wstawianie kolumny");
    console.log(column);
    return this.table.add(column);
  }

  public remove(id: number):Promise<void>{
    return this.table.delete(id);
  }

  public update(column:DexieKanbanColumnDTO):Promise<number>{
    return this.table.update(column.id, column);
  }
}
