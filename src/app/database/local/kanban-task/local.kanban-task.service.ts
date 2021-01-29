import { ResolveEnd } from '@angular/router';
import { IKanbanTaskService } from 'app/database/shared/kanban-task/kanban-task.service';
import { ILabelService } from 'app/database/shared/label/label.service';
import { ISubtaskService } from 'app/database/shared/subtask/subtask.service';
import { LocalKanbanTaskRepository } from './local.kanban-task.repository';
import { LocalTaskRepository } from '../task/local.task.repository';
import { LocalTaskDataService } from '../task/local.task-data.service';
import { KanbanTask } from 'app/database/shared/kanban-task/kanban-task';
import { LocalKanbanColumnRepository } from '../kanban-column/local.kanban-column.repository';

export class LocalKanbanTaskService extends LocalTaskDataService implements IKanbanTaskService{

  constructor(taskRepository: LocalTaskRepository, kanbanTaskReposiotyr: LocalKanbanTaskRepository,
    kanbanColumnRepository: LocalKanbanColumnRepository, subtaskService: ISubtaskService, labelService: ILabelService){
    super(taskRepository, kanbanTaskReposiotyr, kanbanColumnRepository, subtaskService, labelService);
  }

  public getById(id: number): Promise<KanbanTask> {
    return this.kanbanTaskRepository.findById(id).then(kanbanTask=>{
      return this.fetchKanbanTask(kanbanTask);
    });
  }

  private fetchKanbanTask(kanbanTask: KanbanTask): Promise<KanbanTask>{
    return this.taskRepository.findById(kanbanTask.id).then(task=>{
      return this.fetchTask(task).then(fetchedTask=>{
        kanbanTask.task = fetchedTask;
        return Promise.resolve(kanbanTask);
      })
    })
  }

  public getByColumn(columnId: number): Promise<KanbanTask[]> {
    return this.kanbanTaskRepository.findByColumn(columnId).then(tasks=>{
      return Promise.all(tasks.map(task=>this.fetchKanbanTask(task)));
    })
  }

  public getByTask(taskId: number): Promise<KanbanTask> {
    return this.kanbanTaskRepository.findByTask(taskId).then(task=>{
      return this.fetchKanbanTask(task);
    })
  }

  public removeByColumn(columnId: number): Promise<number> {
    return this.kanbanTaskRepository.removeAllFromColumn(columnId);
  }

  public update(task: KanbanTask): Promise<KanbanTask> {
    return this.kanbanTaskRepository.update(task).then(_=>{
      return Promise.resolve(task);
    });
  }

  public changeOrder(currentTask: KanbanTask, previousTask: KanbanTask, currentIndex: number, previousIndex: number) {
    return this.kanbanTaskOrderController.move(currentTask, previousTask, currentIndex, previousIndex);
  }

  public changeColumn(task: KanbanTask, currentTask: KanbanTask, columnId: number) {
    return this.kanbanTaskOrderController.changeContainer(task, currentTask, columnId);
  }
}
