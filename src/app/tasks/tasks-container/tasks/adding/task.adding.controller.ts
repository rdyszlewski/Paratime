import { Task } from 'app/data/models/task';
import { TasksAddingModel } from './task.adding.model';
import { TasksModel } from '../model';
import { DataService } from 'app/data.service';
import { ScrollBarHelper, FocusHelper } from 'app/common/view_helper';
import { EditInputHandler } from 'app/common/edit_input_handler';
import { InsertTaskData } from 'app/data/common/models/insert.task.data';
import { InsertTaskResult } from 'app/data/common/models/insert.task.result';

export class TaskAddingController {
  private TASK_LIST = '#tasks-list';
  private TASK_NAME_INPUT = '#new-task-name';

  private mainModel: TasksModel;
  private model: TasksAddingModel = new TasksAddingModel();

  constructor(mainModel: TasksModel) {
    this.mainModel = mainModel;
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
    const task = this.prepareTaskToInsert();
    const data = new InsertTaskData(
      task,
      null,
      this.mainModel.getProject().getId()
    );
    DataService.getStoreManager()
      .getTaskStore()
      .createTask(data)
      .then((result) => {
        this.updateViewAfterInserting(result);
      });
  }

  private updateViewAfterInserting(result: InsertTaskResult) {
    this.mainModel.updateTasks(result.updatedTasks);
    this.mainModel.addTask(result.insertedTask);
    this.closeAddingNewTask();
    ScrollBarHelper.moveToBottom(this.TASK_LIST);
    // TODO: prawdopodobnie będzie trzeba zaktualizoreplaceTasksOrderwać elementy, w których została zmieniona kolejność
  }

  private prepareTaskToInsert() {
    const task = new Task();
    task.setName(this.model.getNewTaskName());
    task.setProject(this.mainModel.getProject());
    return task;
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
