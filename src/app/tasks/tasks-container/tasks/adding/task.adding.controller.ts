import { TasksAddingModel } from "./task.adding.model";
import { TasksModel } from "../model";
import { FocusHelper, ScrollBarHelper } from "app/shared/common/view_helper";
import { EditInputHandler } from "app/shared/common/edit_input_handler";
import { TaskInsertResult } from "app/database/shared/task/task.insert-result";
import { CommandService } from "app/commands/manager/command.service";
import { CreateTaskCommand } from "app/commands/data-command/task/command.create-task";

export class TaskAddingController {
  private TASK_LIST = "#tasks-list";
  private TASK_NAME_INPUT = "#new-task-name";

  private model: TasksAddingModel = new TasksAddingModel();

  constructor(
    private mainModel: TasksModel,
    private commandService: CommandService,
  ) {}

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
    let callback = (result) => this.updateViewAfterInserting(result);
    this.commandService.execute(new CreateTaskCommand(name, project).setCallback(callback));
  }

  private updateViewAfterInserting(result: TaskInsertResult) {
    // this.mainModel.addTask(result.insertedElement);
    this.mainModel.updateTasks(result.updatedElements);
    this.closeAddingNewTask();
    ScrollBarHelper.moveToBottom(this.TASK_LIST);
  }

  public closeAddingNewTask() {
    this.model.setNewTaskName("");
    this.model.closeAddingTask();
  }

  public handleAddingNewTaskKeyUp(event: KeyboardEvent) {
    EditInputHandler.handleKeyEvent(
      event,
      () => this.addNewTask(),
      () => this.closeAddingNewTask(),
    );
  }
}
