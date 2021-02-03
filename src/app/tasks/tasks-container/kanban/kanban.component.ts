import { Component, OnInit, ViewChild } from '@angular/core';
import { KanbanModel } from './kanban.model';
import {
  CdkDragDrop,
} from '@angular/cdk/drag-drop';
import { Task } from 'app/database/shared/task/task';
import { DataService } from 'app/data.service';
import { Status } from 'app/database/shared/models/status';
import { KanbanTaskOrderController, KanbanColumnOrderController } from './controllers/order.controller';
import { KanbanColumnController } from './controllers/column.controller';
import { ITaskList } from '../task.list';
import { TaskItemInfo } from '../tasks/common/task.item.info';
import { AppService } from 'app/core/services/app/app.service';
import { FocusHelper } from 'app/shared/common/view_helper';
import { EditInputHandler } from 'app/shared/common/edit_input_handler';
import { KanbanColumn } from 'app/database/shared/kanban-column/kanban-column';
import { KanbanTask } from 'app/database/shared/kanban-task/kanban-task';
import { Project } from 'app/database/shared/project/project';
import { CommandService } from 'app/commands/manager/command.service';
import { RemoveTaskCommand } from 'app/commands/data-command/task/command.remove-task';
import { TaskInsertResult } from 'app/database/shared/task/task.insert-result';
import { CreateTaskCommand } from 'app/commands/data-command/task/command.create-task';
import { FinishTaskCommand } from 'app/commands/data-command/task/command.finish-task';
import { TaskRemoveDialog } from '../tasks/dialog/task.remove-dialog';
import { DialogService } from 'app/ui/widgets/dialog/dialog.service';
import { RemoveKanbanTaskCallback } from 'app/commands/data-command/task/clalback.kanban.remove-task';
import { EventBus } from 'eventbus-ts';
import { TaskDetailsEvent } from '../events/details.event';
import { InsertingTemplateComponent } from 'app/tasks/shared/inserting-template/inserting-template.component';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.less'],
})
export class KanbanComponent implements OnInit, ITaskList {

  @ViewChild(InsertingTemplateComponent)
  private insertingTemplateComponent: InsertingTemplateComponent;

  private columnController: KanbanColumnController;

  private model: KanbanModel = new KanbanModel();
  private info: TaskItemInfo = new TaskItemInfo();
  private defaultColumnOpen = true;

  public status = Status;

  constructor(private dialogService: DialogService, private appService: AppService, private dataService: DataService, private commandService: CommandService) {}

  close() {

  }

  ngOnInit(): void {
    this.columnController = new KanbanColumnController(this.model, this.dialogService, this.commandService);
  }

  public getModel() {
    return this.model;
  }

  public getInfo() {
    return this.info;
  }

  public openProject(project: Project) {
    if(!project || project.id < 0){
      return;
    }
    this.model.setProject(project);
    this.loadTasks(project);
  }

  private loadTasks(project: Project) {
    this.dataService.getKanbanColumnService().getByProjectId(project.id).then(columns=>{
      this.model.setColumns(columns);
    })
  }

  public taskDrop(event: CdkDragDrop<Task[]>) {
    KanbanTaskOrderController.drop(event, this.model, this.commandService);
  }

  public columnDrop(event: CdkDragDrop<Task[]>) {
   KanbanColumnOrderController.drop(event, this.model, this.commandService);
  }

  public addColumn(name: string) {
   this.columnController.addColumn(name);
  }

  public isOpen(): boolean {
    return this.model.getProject() != null;
  }

  public isDefaultColumnOpen(): boolean {
    return this.defaultColumnOpen;
  }

  public toggleOpenDefautlColumn(): void {
    this.defaultColumnOpen = !this.defaultColumnOpen;
  }

  public addTask(column: KanbanColumn) {
    const name = this.model.getNewTaskName();
    const project = this.model.getProject();
    let callback = (result:TaskInsertResult) => this.createTaskCallback(result);
    let command = new CreateTaskCommand(name, project).setColumn(column).setCallback(callback)
    this.commandService.execute(command);
    this.closeAddingNewTask();
  }

  private createTaskCallback(result: TaskInsertResult){
    this.model.addTask(result.insertedKanbanTask);
  }

  public  removeTask(kanbanTask: KanbanTask): void {
    let task = kanbanTask.task;
    TaskRemoveDialog.showSingleRemoveQuestion(task, this.dialogService, ()=>{
      let callback = new RemoveKanbanTaskCallback(this.model, kanbanTask);
      this.commandService.execute(new RemoveTaskCommand(task).setCallback(callback))
    })
  }

  public closeAddingNewTask() {
    this.model.setAddingTaskOpen(null);
    this.model.setNewTaskName('');
  }

  public handleAddingKeyUp(event: KeyboardEvent) {
    // TODO: obsługa klawiszy
  }

  public onAddKanbanTaskClick(column: KanbanColumn) {
    this.model.setAddingTaskOpen(column);
    FocusHelper.focus(this.getNewTaskInputId(column));
  }

  private getNewTaskInputId(column: KanbanColumn) {
    return '#new_task_input_' + column.id;
  }

  public openDetails(kanbanTask: KanbanTask) {
    EventBus.getDefault().post(new TaskDetailsEvent(kanbanTask.task));
  }

  public setCurrentTask(task: KanbanTask) {
    this.appService.setCurrentTask(task.task);
  }

  public removeCurrentTask() {
    this.appService.setCurrentTask(null);
  }

  public isCurrentTask(task: KanbanTask): boolean {
    return this.appService.isCurrentTask(task.task);
  }

  public finishTask(kanbanTask: KanbanTask): void {
    let callback = updatedTasks => {}
    this.commandService.execute(new FinishTaskCommand(kanbanTask.task, this.appService, callback));
  }


  public handleAddingNewTask(event: KeyboardEvent) {
    EditInputHandler.handleKeyEvent(
      event,
      () => this.addTask(this.model.getAddingTaskOpen()),
      () => this.closeAddingNewTask()
    );
  }

  public handleEditingColumn(event: KeyboardEvent) {
    EditInputHandler.handleKeyEvent(
      event,
      () => this.updateColumnName(),
      () => this.closeEditingColumnName()
    );
  }

  public updateColumnName() {
    this.columnController.updateColumnName();
    this.closeEditingColumnName();
  }

  public closeEditingColumnName() {
    this.model.setEditedColumn(null);
  }

  public onColumnEdit(column: KanbanColumn) {
    this.model.setEditedColumn(column);
    this.model.setColumnName(column.name);
    FocusHelper.focus('#column-name-' + column.id);
  }

  public onColumnRemove(column: KanbanColumn) {
    this.columnController.removeColumn(column);
  }

  public openColumnInserting(){
    this.insertingTemplateComponent.open();
  }

  public isColumnInsertingOpen():boolean{
    if(this.insertingTemplateComponent){
      return this.insertingTemplateComponent.visible;
    }
  }
}
