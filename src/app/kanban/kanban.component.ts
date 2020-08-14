import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { KanbanModel } from './kanban.model';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { DataService } from 'app/data.service';
import { KanbanColumn, KanbanTask } from 'app/models/kanban';
import { FocusHelper } from 'app/common/view_helper';
import { TaskItemInfo } from 'app/tasks/common/task.item.info';
import { Status } from 'app/models/status';
import { InsertTaskData } from 'app/data/common/models/insert.task.data';
import { DialogHelper } from 'app/common/dialog';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from 'app/services/app/app.service';
import { EditInputHandler } from 'app/common/edit_input_handler';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css'],
})
export class KanbanComponent implements OnInit {
  // TODO: zrobić rozdzielenie kolumn i zadań (chyba)
  @Output() closeEvent: EventEmitter<null> = new EventEmitter();
  @Output() pomodoroEvent: EventEmitter<Task> = new EventEmitter();
  @Output() detailsEvent: EventEmitter<Task> = new EventEmitter();
  @Output() removeEvent: EventEmitter<Task> = new EventEmitter();

  private model: KanbanModel = new KanbanModel();
  private info: TaskItemInfo = new TaskItemInfo();
  private defaultColumnOpen = true;

  public status = Status;

  constructor(private dialog: MatDialog, private appService: AppService) {}

  ngOnInit(): void {}

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
    DataService.getStoreManager()
      .getKanbanColumnStore()
      .getByProject(project.getId())
      .then((columns) => {
        this.model.setColumns(columns);
        this.model.setTasks(columns);
      });
  }

  public drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      this.changeTasksOrder(
        event.container.id,
        event.previousIndex,
        event.currentIndex
      );
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      this.moveTaskToColumn(
        event.previousContainer.id,
        event.container.id,
        event.previousIndex,
        event.currentIndex
      );
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  private changeTasksOrder(
    column: string,
    previousIndex: number,
    currentIndex: number
  ) {
    const currentColumn = this.model.getColumnById(Number.parseInt(column));
    const previousTask = this.model.getTaskByIndex(
      previousIndex,
      currentColumn.getId()
    );
    const currentTask = this.model.getTaskByIndex(
      currentIndex,
      currentColumn.getId()
    );
    DataService.getStoreManager()
      .getKanbanTaskStore()
      .move(previousTask, currentTask, previousIndex > currentIndex)
      .then((updatedTask) => {
        this.model.updateTasks(updatedTask, currentColumn.getId());
      });
  }

  private moveTaskToColumn(
    previousColumnId: string,
    currentColumnId: string,
    previousIndex: number,
    currentIndex: number
  ) {
    const previousColumn = this.model.getColumnById(
      Number.parseInt(previousColumnId)
    );
    const currentColumn = this.model.getColumnById(
      Number.parseInt(currentColumnId)
    );
    const previousTask = this.model.getTaskByIndex(
      previousIndex,
      previousColumn.getId()
    );
    let currentTask = this.model.getTaskByIndex(
      currentIndex,
      currentColumn.getId()
    );
    if (previousTask == currentTask) {
      currentTask = null;
    }

    DataService.getStoreManager()
      .getKanbanTaskStore()
      .changeContainer(previousTask, currentTask, currentColumn.getId())
      .then((updatedTask) => {
        this.model.updateTasks(updatedTask, currentColumn.getId());
        this.model.updateTasks(updatedTask, previousColumn.getId());
      });
  }

  public columnDrop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      this.changeColumnsOrder(event.previousIndex, event.currentIndex);
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  private changeColumnsOrder(previousIndex: number, currentIndex: number) {
    if (previousIndex == currentIndex) {
      return;
    }
    const previousColumn = this.model.getColumnByIndex(previousIndex);
    const currentColumn = this.model.getColumnByIndex(currentIndex);
    if (previousColumn.isDefault() || currentColumn.isDefault()) {
      return;
    }
    DataService.getStoreManager()
      .getKanbanColumnStore()
      .move(previousColumn, currentColumn, previousIndex > currentIndex)
      .then((updatedColumns) => {
        this.model.updateColumns(updatedColumns);
      });
  }

  public closeView() {
    this.closeEvent.emit();
  }

  public addColumn() {
    console.log(this.model.getColumnName());
    const columnName = this.model.getColumnName();
    if (!columnName || columnName == '') {
      this.model.setColumnNameValid(false);
      FocusHelper.focus('#new-column-input');
      return;
    }
    const kanbanColumn = new KanbanColumn();
    kanbanColumn.setDefault(false);
    kanbanColumn.setProjectId(this.model.getProject().getId());
    kanbanColumn.setName(this.model.getColumnName());

    DataService.getStoreManager()
      .getKanbanColumnStore()
      .create(kanbanColumn)
      .then((result) => {
        this.model.updateColumns(result.updatedColumns);
        this.model.setColumnNameValid(true);
        this.model.closeAdddingColumn();
      });
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
  public addNewTask(column: KanbanColumn) {
    const task = this.prepareTaskToInsert();
    const data = new InsertTaskData(
      task,
      column,
      this.model.getProject().getId()
    );

    DataService.getStoreManager()
      .getTaskStore()
      .createTask(data)
      .then((result) => {
        this.model.updateTasks(result.updatedKanbanTasks, data.column.getId());
      });
    this.closeAddingNewTask();
  }

  private prepareTaskToInsert() {
    const task = new Task(this.model.getNewTaskName());
    task.setProject(this.model.getProject());
    return task;
  }

  public onRemoveTask(task: KanbanTask) {
    const message = 'Czy na pewno usunąć zadanie?';
    DialogHelper.openDialog(message, this.dialog).subscribe((result) => {
      if (result) {
        this.removeTask(task);
      }
    });
  }

  private removeTask(task: KanbanTask): void {
    DataService.getStoreManager()
      .getKanbanTaskStore()
      .removeTask(task.getId())
      .then((updatedTasks) => {
        this.model.updateTasks(updatedTasks, task.getColumnId());
        this.removeEvent.emit(task.getTask());
      });
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

  public onTaskEdit(task: KanbanTask) {
    console.log('OnTaskEdit');
    this.detailsEvent.emit(task.getTask());
  }

  public onTaskDelete(task: KanbanTask) {
    // TODO: można przenieść
    const message = 'Czy na pewno usunąć zadanie?';
    DialogHelper.openDialog(message, this.dialog).subscribe((result) => {
      if (result) {
        this.removeTask(task);
      }
    });
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
    DataService.getStoreManager()
      .getTaskStore()
      .changeStatus(task.getTask(), Status.ENDED)
      .then((updatedTasks) => {
        // tutaj nie robimy nic. Zostawiamy zakończone zadania na liście
      });
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
      () => this.addNewTask(this.model.getAddingTaskOpen()),
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
    this.model.getEditedColumn().setName(this.model.getColumnName());
    DataService.getStoreManager()
      .getKanbanColumnStore()
      .update(this.model.getEditedColumn());
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
    const message = 'Czy na pewno usunąć kolumnę?';
    DialogHelper.openDialog(message, this.dialog).subscribe((result) => {
      if (result) {
        this.removeColumn(column);
      }
    });
  }

  private removeColumn(column: KanbanColumn) {
    // TODO: zastanowić się, czy przenieść wszystkie zadania do nieprzypisanych, czy usunąć
    DataService.getStoreManager()
      .getKanbanColumnStore()
      .remove(column.getId())
      .then((updatedColumns) => {
        this.model.updateColumns(updatedColumns);
      });
  }
}
