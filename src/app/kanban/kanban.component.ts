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

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css'],
})
export class KanbanComponent implements OnInit {
  // TODO: zrobić rozdzielenie kolumn i zadań (chyba)
  @Output() closeEvent: EventEmitter<null> = new EventEmitter();

  private model: KanbanModel = new KanbanModel();
  private info: TaskItemInfo = new TaskItemInfo();
  private defaultColumnOpen = true;

  public status = Status;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  public getModel() {
    return this.model;
  }

  public getInfo() {
    return this.info;
  }

  public openProject(project: Project) {
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
    const previousColumn = this.model.getColumnById(Number.parseInt(previousColumnId));
    const currentColumn = this.model.getColumnById(Number.parseInt(currentColumnId));
    const previousTask = this.model.getTaskByIndex(previousIndex, previousColumn.getId());
    let currentTask = this.model.getTaskByIndex(currentIndex, currentColumn.getId());
    if (previousTask == currentTask) {
      currentTask = null;
    }

    DataService.getStoreManager().getKanbanTaskStore()
      .changeContainer(previousTask, currentTask, currentColumn.getId()).then((updatedTask) => {
        this.model.updateTasks(updatedTask, currentColumn.getId());
        this.model.updateTasks(updatedTask, previousColumn.getId());
      });
  }

  public columnDrop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      this.changeColumnsOrder(event.previousIndex, event.currentIndex);
      moveItemInArray(event.container.data,event.previousIndex,event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,event.container.data,event.previousIndex,event.currentIndex);
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
    const kanbanColumn = new KanbanColumn();
    kanbanColumn.setDefault(false);
    kanbanColumn.setProjectId(this.model.getProject().getId());
    kanbanColumn.setName(this.model.getColumnName());

    DataService.getStoreManager()
      .getKanbanColumnStore()
      .create(kanbanColumn)
      .then((result) => {
        this.model.updateColumns(result.updatedColumns);
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
        // TODO: wysłać event o usunięciu zadania
      });
  }

  public closeAddingNewTask() {
    this.model.setColumnAddingOpen(null);
    this.model.setNewTaskName('');
  }

  public handleAddingKeyUp(event: KeyboardEvent) {
    // TODO: obsługa klawiszy
  }

  public onAddKanbanTaskClick(column: KanbanColumn) {
    this.model.setColumnAddingOpen(column);
    FocusHelper.focus(this.getNewTaskInputId(column));
  }

  private getNewTaskInputId(column: KanbanColumn) {
    return '#new_task_input_' + column.getId();
  }

  public onTaskEdit(task: Task) {
    // TODO: obsługa edytowania
  }

  public onTaskDelete(task: Task) {
    // TODO: usuwanie zadania
  }
}
