import { InsertResult } from 'app/database/shared/insert-result';
import { KanbanColumn } from 'app/database/shared/kanban-column/kanban-column';
import { IKanbanColumnService } from 'app/database/shared/kanban-column/kanban-column.service';
import { IKanbanTaskService } from 'app/database/shared/kanban-task/kanban-task.service';
import { LocalOrderController } from '../order/local.orderable.service';
import { LocalKanbanColumnRepository } from './local.kanban-column.repository';


export class LocalKanbanColumnService implements IKanbanColumnService{

  private orderController: LocalOrderController<KanbanColumn>;

  constructor(private repository: LocalKanbanColumnRepository, private kanbanTaskService: IKanbanTaskService){
    this.orderController = new LocalOrderController(repository);
  }

  public getById(id: number): Promise<KanbanColumn> {
    return this.repository.findById(id).then(column=>{
      return this.fetchColumn(column);
    });
  }

  private fetchColumn(column: KanbanColumn):Promise<KanbanColumn>{
    return this.kanbanTaskService.getByColumn(column.id).then(tasks=>{
      column.kanbanTasks = tasks;
      return Promise.resolve(column);
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
    return this.repository.findDefaultColumn(projectId);
  }

  public create(column: KanbanColumn): Promise<InsertResult<KanbanColumn>> {
    return this.insertColumn(column).then(insertedColumn=>{
      return this.orderInsertColumn(insertedColumn);
    });
  }

  private insertColumn(column:KanbanColumn): Promise<KanbanColumn>{
    return this.repository.insert(column).then(insertedId=>{
      return this.repository.findById(insertedId);
    })
  }

  private orderInsertColumn(insertedColumn: KanbanColumn):Promise<InsertResult<KanbanColumn>>{
    return this.orderController.insert(insertedColumn, null, insertedColumn.projectId).then(updatedColumns=>{
      return Promise.resolve(new InsertResult(insertedColumn, updatedColumns));
    })
  }

  public remove(column: KanbanColumn): Promise<KanbanColumn[]> {
    return this.kanbanTaskService.removeByColumn(column.id).then(()=>{
      return this.repository.remove(column).then(()=>{
        return this.orderController.remove(column);
      });
    });
  }

  public update(column: KanbanColumn): Promise<KanbanColumn> {
    return this.repository.update(column).then(_=>{
      return Promise.resolve(column);
    });
  }

  public removeByProject(projectId: number): Promise<void> {
    return this.repository.findByProjectId(projectId).then(columns=>{
      let actions = columns.map(column=>this.remove(column));
      return Promise.all(actions).then(_=>{
        return Promise.resolve(null);
      });
    })
  }

  public changeOrder(currentColumn: KanbanColumn, previousColumn: KanbanColumn, currentIndex: number, previousIndex: number) {
    return this.orderController.move(currentColumn, previousColumn, currentIndex, previousIndex);
  }
}
