import { TasksAddingModel } from './task.adding.model';
import { TasksModel } from '../model';
import { FocusHelper, ScrollBarHelper } from 'app/shared/common/view_helper';
import { EditInputHandler } from 'app/shared/common/edit_input_handler';
import { TasksService } from 'app/tasks/tasks.service';
import { TaskInsertResult } from 'app/database/model/task.insert-result';

export class TaskAddingController {
  private TASK_LIST = '#tasks-list';
  private TASK_NAME_INPUT = '#new-task-name';

  private mainModel: TasksModel;
  private model: TasksAddingModel = new TasksAddingModel();
  private tasksService: TasksService;

  constructor(mainModel: TasksModel, tasksService: TasksService) {
    this.mainModel = mainModel;
    this.tasksService = tasksService;
  }

  public getModel() {
    return this.model;
  }

  public openAddingTask() {
    this.model.openAddingTask();
    FocusHelper.focus(this.TASK_NAME_INPUT);
    ScrollBarHelper.moveToBottom(this.TASK_LIST);
  }

  public addNewTask() {
    this.saveTask();
  }

  private saveTask() {
    const name = this.model.getNewTaskName();
    const project = this.mainModel.getProject();
    this.tasksService.addTask(name, project).then(result=>{
      this.updateViewAfterInserting(result);
    });
  }

  private updateViewAfterInserting(result: TaskInsertResult) {
    this.mainModel.updateTasks(result.updatedElements);
    this.mainModel.addTask(result.insertedElement);
    this.closeAddingNewTask();
    ScrollBarHelper.moveToBottom(this.TASK_LIST);
  }

  public closeAddingNewTask() {
    this.model.setNewTaskName('');
    this.model.closeAddingTask();
  }

  public handleAddingNewTaskKeyUp(event: KeyboardEvent) {
    EditInputHandler.handleKeyEvent(
      event,
      () => this.addNewTask(),
      () => this.closeAddingNewTask()
    );
  }
}
