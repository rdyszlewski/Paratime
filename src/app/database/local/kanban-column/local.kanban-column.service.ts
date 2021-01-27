import { InsertResult } from 'app/database/shared/insert-result';
import { KanbanColumn } from 'app/database/shared/kanban-column/kanban-column';
import { IKanbanColumnService } from 'app/database/shared/kanban-column/kanban-column.service';
import { IKanbanTaskService } from 'app/database/shared/kanban-task/kanban-task.service';
import { LocalOrderController } from '../order/local.orderable.service';
import { DexieKanbanColumnDTO } from './local.kanban-column';
import { LocalKanbanColumnRepository } from './local.kanban-column.repository';


export class LocalKanbanColumnService implements IKanbanColumnService{

  private orderController: LocalOrderController<DexieKanbanColumnDTO>;

  constructor(private repository: LocalKanbanColumnRepository, private kanbanTaskService: IKanbanTaskService){
    this.orderController = new LocalOrderController(repository);
  }

  public getById(id: number): Promise<KanbanColumn> {
    return this.repository.findById(id).then(column=>{
      return this.fetchColumn(column);
    });
  }

  private fetchColumn(column: DexieKanbanColumnDTO): Promise<KanbanColumn>{
    let kanbanColumn = column.getModel();
    return this.kanbanTaskService.getByColumn(kanbanColumn.id).then(tasks=>{
      kanbanColumn.kanbanTasks = tasks;
      return Promise.resolve(kanbanColumn);
    });
  }


  public getByProjectId(projectId: number): Promise<KanbanColumn[]> {
    return this.repository.findByProjectId(projectId).then(columns=>{
      let promises = columns.map(column=>this.fetchColumn(column));
      return Promise.all(promises);
    });
  }

  public getDefaultColumn(projectId: number): Promise<KanbanColumn> {
    // bez fetchowania?
    return this.repository.findDefaultColumn(projectId).then(column=>{
      return Promise.resolve(column.getModel());
    });
  }

  public create(column: KanbanColumn): Promise<InsertResult<KanbanColumn>> {
    return this.insertColumn(new DexieKanbanColumnDTO(column)).then(insertedColumn=>{
      console.log("InsertedColumn");
      console.log(insertedColumn);

      return this.orderInsertColumn(insertedColumn);
    });
  }

  private insertColumn(column:DexieKanbanColumnDTO): Promise<DexieKanbanColumnDTO> {
    return this.repository.insert(column).then(insertedId=>{
      console.log("InsertedId");
      console.log(insertedId);
      return this.repository.findById(insertedId);
    })
  }

  private orderInsertColumn(insertedColumn: DexieKanbanColumnDTO):Promise<InsertResult<KanbanColumn>>{
    return this.orderController.insert(insertedColumn, null, insertedColumn.projectId).then(updatedColumns=>{
      return Promise.resolve(new InsertResult(insertedColumn.getModel(), updatedColumns.map(x=>x.getModel())));
    })
  }

  public remove(column: KanbanColumn): Promise<KanbanColumn[]> {
    return this.kanbanTaskService.removeByColumn(column.id).then(()=>{
      return this.repository.findById(column.id).then(columnDTO=>{
        return this.repository.remove(column.id).then(()=>{
          // TODO: sprawdzić, czy to będzie działać poprawnie
          return this.mapToColumnPromise(this.orderController.remove(columnDTO));
        });
      });
    });
  }

  private mapToColumnPromise(dtoPromise: Promise<DexieKanbanColumnDTO[]>): Promise<KanbanColumn[]>{
    return dtoPromise.then(result=>{
      return Promise.resolve(result.map(x=>x.getModel()));
    })
  }

  public update(column: KanbanColumn): Promise<KanbanColumn> {
    let columnDTO = new DexieKanbanColumnDTO(column);
    // TODO: możliwe, że lepiej będzie jeżeli pobierzemy tutaj zawartość. Kolejności mogą się zmienić. Będzie trzeba to sprawdzić
    return this.repository.update(columnDTO).then(_=>{
      return Promise.resolve(column);
    });
  }

  public removeByProject(projectId: number): Promise<void> {
    return this.repository.findByProjectId(projectId).then(columns=>{
      // TODO: sprawdzić czy to będzie ok
      let actions = columns.map(column=>this.remove(column.getModel()));
      return Promise.all(actions).then(_=>{
        return Promise.resolve(null);
      });
    })
  }

  public changeOrder(currentColumn: KanbanColumn, previousColumn: KanbanColumn, currentIndex: number, previousIndex: number) {
    let promises = [
      this.repository.findById(currentColumn.id),
      this.repository.findById(previousColumn.id)
    ];
    return Promise.all(promises).then(results=>{
      return this.orderController.move(results[0], results[1], currentIndex, previousIndex);
    });
  }
}
