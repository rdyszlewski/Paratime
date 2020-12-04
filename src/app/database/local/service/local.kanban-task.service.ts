import { ResolveEnd } from '@angular/router';
import { IKanbanTaskService } from 'app/database/common/kanban-task.service';
import { ILabelService } from 'app/database/common/label.service';
import { ISubtaskService } from 'app/database/common/subtask.service';
import { KanbanTask } from 'app/database/data/models/kanban';
import { LocalKanbanColumnRepository } from '../repository/local.kanban-column.repository';
import { LocalKanbanTaskRepository } from '../repository/local.kanban-task';
import { LocalTaskRepository } from '../repository/local.task.repository';
import { LocalTaskDataService } from './local.task-data.service';

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
    return this.taskRepository.findById(kanbanTask.getTaskId()).then(task=>{
      return this.fetchTask(task).then(fetchedTask=>{
        kanbanTask.setTask(fetchedTask);
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
