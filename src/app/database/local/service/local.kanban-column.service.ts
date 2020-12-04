import { IKanbanColumnService } from 'app/database/common/kanban-column.service';
import { IKanbanTaskService } from 'app/database/common/kanban-task.service';
import { KanbanColumn } from 'app/database/data/models/kanban';
import { InsertResult } from 'app/database/model/insert-result';
import { LocalKanbanColumnRepository } from '../repository/local.kanban-column.repository';
import { LocalOrderController } from './local.orderable.service';

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
    return this.kanbanTaskService.getByColumn(column.getId()).then(tasks=>{
      column.setKanbanTasks(tasks);
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
    return this.orderController.insert(insertedColumn, null, insertedColumn.getProjectId()).then(updatedColumns=>{
      return Promise.resolve(new InsertResult(insertedColumn, updatedColumns));
    })
  }

  public remove(column: KanbanColumn): Promise<KanbanColumn[]> {
    return this.kanbanTaskService.removeByColumn(column.getId()).then(()=>{
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
