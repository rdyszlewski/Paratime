import { IKanbanTasksRepository } from '../repositories/kanban_tasks_repository';
import { IOrderableStore } from './orderable.store';
import { KanbanTask, KanbanColumn } from 'app/data/models/kanban';
import { TaskStore } from './task_store';
import { InsertKanbanTaskResult } from '../models/insert.kanban.task.result';
import { InsertTaskData } from '../models/insert.task.data';
import { IKanbanColumnsRepository } from '../repositories/kanban_columns_repository';
import { StoreOrderController } from '../order/order.controller';

export class KanbanTaskStore implements IOrderableStore<KanbanTask>{

  private kanbanTasksRepository: IKanbanTasksRepository;
  private kanbanColumnRepository: IKanbanColumnsRepository;
  private taskStore: TaskStore;

  private orderController: StoreOrderController<KanbanTask>

  constructor(kanbanTasksRepository: IKanbanTasksRepository, kanbanColumnRepository: IKanbanColumnsRepository){
    this.kanbanTasksRepository = kanbanTasksRepository;
    this.kanbanColumnRepository = kanbanColumnRepository;

    this.orderController = new StoreOrderController(kanbanTasksRepository);
  }

  // ogarnąć to jakoś inaczej
  public setTaskStore(taskStore: TaskStore){
    this.taskStore = taskStore;
  }


  // TODO: zrobić coś z prywatnością tego
  public insert(item: KanbanTask, beforeTask: KanbanTask, containerId: number): Promise<KanbanTask[]> {
    return this.orderController.insert(item, beforeTask, containerId);
  }

  // TODO: tutaj też zrobić coś z ptywatnością
  public remove(item: KanbanTask): Promise<KanbanTask[]> {
    return this.orderController.remove(item);
  }

  public removeTask(kanbanTaskId: number): Promise<KanbanTask[]>{
    return this.getById(kanbanTaskId).then(task=>{
      return this.kanbanTasksRepository.removeTask(kanbanTaskId).then(()=>{
        return this.remove(task);
      });
    });
  }

  public removeByColumn(columnId: number): Promise<void>{
    return this.kanbanTasksRepository.removeTasksByColumn(columnId);
  }


  private getById(id:number): Promise<KanbanTask>{
    return this.kanbanTasksRepository.findById(id).then(kanbanTask=>{
      return this.fillKanbanTask(kanbanTask);
    });
  }

  private fillKanbanTask(kanbanTask: KanbanTask): Promise<KanbanTask>{
    return this.taskStore.getById(kanbanTask.getTaskId()).then(task=>{
        kanbanTask.setTask(task);
        return Promise.resolve(kanbanTask);
    });
  }

  public getByColumn(columnId: number): Promise<KanbanTask[]>{
    return this.kanbanTasksRepository.findTasksByColumn(columnId).then(kanbanTasks=>{
      const promises = kanbanTasks.map(task=>this.fillKanbanTask(task));
      return Promise.all(promises);
    });
  }

  public create(data: InsertTaskData): Promise<InsertKanbanTaskResult>{
    const result: InsertKanbanTaskResult = new InsertKanbanTaskResult();
    return this.prepareKanbanColumn(data).then(column=>{
      const kanbanTask = this.createKanbanTaskToInsert(data, column.getId());
      return this.insertKanbanTask(kanbanTask).then(insertedTask=>{
        result.insertedKanbanTask = insertedTask;
        return this.insert(insertedTask, null, column.getId()).then(updatedItems=>{
          result.updatedKanbanTask = updatedItems;
          return Promise.resolve(result);
        });
      });
    });
  }

  private prepareKanbanColumn(data: InsertTaskData):Promise<KanbanColumn>{
    let columnPromise:Promise<KanbanColumn>;
    if(data.column != null){
        columnPromise = Promise.resolve(data.column);
    } else {
      columnPromise = this.kanbanColumnRepository.findDefaultColumn(data.projectId);
    }
    return columnPromise;
  }

  private createKanbanTaskToInsert(data: InsertTaskData, columnId: number) {
    const kanbanTask = new KanbanTask();
    kanbanTask.setTask(data.task);
    kanbanTask.setColumnId(columnId);
    return kanbanTask;
  }

  private insertKanbanTask(kanbanTask:KanbanTask):Promise<KanbanTask>{
    return this.kanbanTasksRepository.insertTask(kanbanTask).then(insertedId=>{
        return this.getById(insertedId);
    });
  }

  public update(kanbanTask: KanbanTask): Promise<KanbanTask>{
    return this.kanbanTasksRepository.update(kanbanTask).then(result=>{
      return Promise.resolve(kanbanTask);
  });
  }

  public move(previousItem: KanbanTask, currentItem: KanbanTask, moveUp:boolean): Promise<KanbanTask[]> {
    return this.orderController.move(previousItem, currentItem, moveUp);
  }

  public changeContainer(item: KanbanTask, currentTask: KanbanTask, currentContainerId: number): Promise<KanbanTask[]> {
    return this.orderController.changeContainer(item, currentTask, currentContainerId);
  }
}
