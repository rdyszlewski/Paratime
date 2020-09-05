import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { KanbanModel } from './kanban.model';
import {
  CdkDragDrop,
} from '@angular/cdk/drag-drop';
import { Task } from 'app/data/models/task';
import { Project } from 'app/data/models/project';
import { DataService } from 'app/data.service';
import { KanbanColumn, KanbanTask } from 'app/data/models/kanban';
import { FocusHelper } from 'app/common/view_helper';
import { Status } from 'app/data/models/status';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from 'app/services/app/app.service';
import { EditInputHandler } from 'app/common/edit_input_handler';
import { KanbanTaskOrderController, KanbanColumnOrderController } from './controllers/order.controller';
import { KanbanTaskController } from './controllers/task.controller';
import { KanbanColumnController } from './controllers/column.controller';
import { ITaskList } from '../task.list';
import { TaskItemInfo } from '../tasks/common/task.item.info';



@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css'],
})
export class KanbanComponent implements OnInit, ITaskList {
  // TODO: refaktoryzacja
  // TODO: zrobić rozdzielenie kolumn i zadań (chyba)
  @Output() closeEvent: EventEmitter<null> = new EventEmitter();
  @Output() pomodoroEvent: EventEmitter<Task> = new EventEmitter();
  @Output() detailsEvent: EventEmitter<Task> = new EventEmitter();
  @Output() removeEvent: EventEmitter<Task> = new EventEmitter();

  private taskController: KanbanTaskController;
  private columnController: KanbanColumnController;

  private model: KanbanModel = new KanbanModel();
  private info: TaskItemInfo = new TaskItemInfo();
  private defaultColumnOpen = true;

  public status = Status;

  constructor(private dialog: MatDialog, private appService: AppService) {}

  ngOnInit(): void {
    this.taskController = new KanbanTaskController(this.model, this.dialog, this.removeEvent);
    this.columnController = new KanbanColumnController(this.model, this.dialog);
  }

  public getModel() {
    return this.model;
  }

  public getInfo() {
    return this.info;
  }

  public openProject(project: Project) {
    if(!project || project.getId() < 0){
      return;
    }
    this.model.setProject(project);
    this.loadTasks(project);
  }

  private loadTasks(project: Project) {
    DataService.getStoreManager()
      .getKanbanColumnStore()
      .getByProject(project.getId())
      .then((columns) => {
        this.model.setColumns(columns);
        this.model.setTasks(columns);
      });
  }

  public taskDrop(event: CdkDragDrop<Task[]>) {
    KanbanTaskOrderController.drop(event, this.model);
  }

  public columnDrop(event: CdkDragDrop<Task[]>) {
   KanbanColumnOrderController.drop(event, this.model);
  }

  public closeView() {
    this.closeEvent.emit();
  }

  public addColumn() {
   this.columnController.addColumn();
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

  // TODO: całe dodwanie przenieść w inne miejsce
  public addTask(column: KanbanColumn) {
    this.taskController.addTask(column);
    this.closeAddingNewTask();
  }

  public  removeTask(task: KanbanTask): void {
    this.taskController.removeTask(task);
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
    return '#new_task_input_' + column.getId();
  }

  public openDetails(task: KanbanTask) {
    console.log('OnTaskEdit');
    this.detailsEvent.emit(task.getTask());
  }

  public setCurrentTask(task: KanbanTask) {
    console.log(task);
    this.appService.setCurrentTask(task.getTask());
  }

  public removeCurrentTask() {
    this.appService.setCurrentTask(null);
  }

  public isCurrentTask(task: KanbanTask): boolean {
    const currentTask = this.appService.getCurrentTask();
    if (currentTask) {
      return currentTask.getId() == task.getTask().getId();
    }
    return false;
  }

  public finishTask(task: KanbanTask): void {
    this.taskController.finishTask(task);
  }

  public addToPomodoro(task: KanbanTask): void {
    this.pomodoroEvent.emit(task.getTask());
  }

  public handleAddingNewColumn(event: KeyboardEvent) {
    EditInputHandler.handleKeyEvent(
      event,
      () => this.addColumn(),
      () => this.model.closeAdddingColumn()
    );
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
    this.model.setColumnName(column.getName());
    FocusHelper.focus('#column-name-' + column.getId());
  }

  public onColumnRemove(column: KanbanColumn) {
    this.columnController.removeColumn(column);
  }
}
