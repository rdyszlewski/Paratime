import { IKanbanColumnsRepository } from '../repositories/kanban_columns_repository';
import { KanbanColumn } from 'app/models/kanban';
import { KanbanTaskStore } from './kanban.task.store';
import { IOrderableStore } from './orderable.store';
import { StoreOrderController } from '../order/order.controller';
import { InsertColumnResult } from '../models/insert.column.result';

export class KanbanColumnStore implements IOrderableStore<KanbanColumn> {
  private kanbanColumnsRepository: IKanbanColumnsRepository;
  private kanbanTaskStore: KanbanTaskStore;
  private orderController: StoreOrderController<KanbanColumn>;

  constructor(
    kanbanColumnRepository: IKanbanColumnsRepository,
    kanbanTaskStore: KanbanTaskStore
  ) {
    this.kanbanColumnsRepository = kanbanColumnRepository;
    this.kanbanTaskStore = kanbanTaskStore;
    this.orderController = new StoreOrderController(kanbanColumnRepository);
  }

  public getById(columnId: number): Promise<KanbanColumn> {
    return this.kanbanColumnsRepository.findById(columnId).then((column) => {
      // return this.fillKanbanColumn(column);
      return this.kanbanTaskStore.getByColumn(column.getId()).then((tasks) => {
        column.setKanbanTasks(tasks);
        return Promise.resolve(column);
      });
    });
  }

  public getByProject(projectId: number): Promise<KanbanColumn[]> {
    return this.kanbanColumnsRepository
      .findByProject(projectId)
      .then((columns) => {
        const tasksPromise = columns.map((column) =>
          this.kanbanTaskStore.getByColumn(column.getId()).then((tasks) => {
            column.setKanbanTasks(tasks);
            return Promise.resolve(column);
          })
        );
        return Promise.all(tasksPromise);
      });
  }

  public getDefaultColumn(projectId: number): Promise<KanbanColumn> {
    return this.kanbanColumnsRepository.findDefaultColumn(projectId);
  }

  public create(column: KanbanColumn): Promise<InsertColumnResult> {
    // TODO: można dać tutaj jakiś inny typ wnu,wynkiku
    return this.kanbanColumnsRepository.insert(column).then((insertedId) => {
      return this.getById(insertedId).then((column) => {
        return this.orderController
          .insert(column, null, column.getProjectId())
          .then((updatedColumns) => {
            const result = new InsertColumnResult();
            result.insertedColumn = column;
            result.updatedColumns = updatedColumns;
            return Promise.resolve(result);
          });
      });
    });
  }

  public  update(column: KanbanColumn): Promise<KanbanColumn> {
    return this.kanbanColumnsRepository.update(column).then((updatedId) => {
      return Promise.resolve(column);
    });
  }

  public remove(columnId: number): Promise<KanbanColumn[]> {
    return this.kanbanColumnsRepository.findById(columnId).then((column) => {
      return this.kanbanColumnsRepository.remove(columnId).then(() => {
        return this.kanbanTaskStore.removeByColumn(columnId).then(() => {
          return this.orderController.remove(column);
        });
      });
    });
  }

  public removeByProject(projectId: number): Promise<void> {
    return this.kanbanColumnsRepository
      .findByProject(projectId)
      .then((columns) => {
        const promises = columns.map((column) =>
          this.kanbanTaskStore.removeByColumn(column.getId())
        );
        return Promise.all(promises).then(() => {
          return this.kanbanColumnsRepository.removeByProject(projectId);
        });
      });
  }

  public move(
    previousItem: KanbanColumn,
    currentItem: KanbanColumn,
    moveUp: boolean
  ): Promise<KanbanColumn[]> {
    return this.orderController.move(previousItem, currentItem, moveUp);
  }

  public changeContainer(
    item: KanbanColumn,
    currentTask: KanbanColumn,
    currentContainerId: number
  ): Promise<KanbanColumn[]> {
    return this.orderController.changeContainer(
      item,
      currentTask,
      currentContainerId
    );
  }
}
