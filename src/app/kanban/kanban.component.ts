import { Component, OnInit, Output, EventEmitter, ɵsetCurrentInjector, ComponentFactoryResolver } from '@angular/core';
import { KanbanModel } from './kanban.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { DataService } from 'app/data.service';
import { KanbanColumn, KanbanTask } from 'app/models/kanban';
import { FocusHelper } from 'app/common/view_helper';
import { TaskItemInfo } from 'app/tasks/common/task.item.info';
import { Status } from 'app/models/status';
import { InsertTaskData } from 'app/data/common/models/insert.task.data';
import { InsertTaskResult } from 'app/data/common/models/insert.task.result';
import { OrderController } from 'app/common/order/order.controller';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit {

  @Output() closeEvent: EventEmitter<null> = new EventEmitter();

  private model: KanbanModel = new KanbanModel();
  private info: TaskItemInfo = new TaskItemInfo();
  // TODO: tutaj jakoś wstawić obsługę menu
  private defaultColumnOpen = true;
  private orderController: OrderController<KanbanTask> = new OrderController();

  public status = Status;

  constructor() { }

  ngOnInit(): void {
  }

  public getModel(){
    return this.model;
  }

  public getInfo(){
    return this.info;
  }

  public openProject(project:Project){
    this.model.clearColumns();
    this.model.setProject(project);
    // TPDP: przyjrzeć się temu. Pomyśleć, jak to można dobrze zrobić
      DataService.getStoreManager().getKanbanStore().getColumnsByProject(project.getId()).then(columns=>{
        columns.forEach(column=>{
          this.model.addColumn(column);
        })
      });
  }

  public drop(event: CdkDragDrop<Task[]>){
    if(event.previousContainer === event.container){
      this.changeTasksOrder(event.container.id, event.previousIndex, event.currentIndex);
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.moveTaskToColumn(event.previousContainer.id, event.container.id, event.previousIndex, event.currentIndex);
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  private changeTasksOrder(column: string, previousIndex: number, currentIndex: number){
    const currentColumn = this.model.getColumnById(Number.parseInt(column));
    const kanbanTasksToUpdate = this.orderController.move(previousIndex, currentIndex, currentColumn.getKanbanTasks());
    this.updateKanbanTasks(kanbanTasksToUpdate);
  }

  private moveTaskToColumn(previousColumnId: string, currentColumnId:string, previousIndex: number, currentIndex: number){
      const previousColumn = this.model.getColumnById(Number.parseInt(previousColumnId));
      const currentColumn = this.model.getColumnById(Number.parseInt(currentColumnId));
      const previousTask = previousColumn.getKanbanTasks()[previousIndex];

      let toUpdate = this.splitKanbanTaskColumns(previousColumn, previousTask, currentColumn, currentIndex);
      this.updateKanbanTasks(toUpdate);
  }

  private splitKanbanTaskColumns(previousColumn: KanbanColumn, previousTask: KanbanTask, currentColumn: KanbanColumn, currentIndex: number) {
    let toUpdate = [];
    toUpdate = toUpdate.concat(this.orderController.removeItem(previousTask, previousColumn.getKanbanTasks()));
    toUpdate = toUpdate.concat(this.orderController.insertItem(previousTask, currentIndex, currentColumn.getKanbanTasks()));
    return toUpdate;
  }

  private updateKanbanTasks(toUpdate: any[]) {
    const promises = [];
    toUpdate.forEach(task => {
      promises.push(DataService.getStoreManager().getKanbanStore().updateKanbanTask(task));
    });
    Promise.all(promises).then(() => {
    });
  }

  public closeView(){
    this.closeEvent.emit();
  }

  public addColumn(){
     const kanbanColumn = new KanbanColumn();
     kanbanColumn.setDefault(false);
     kanbanColumn.setProjectId(this.model.getProject().getId());
     kanbanColumn.setName(this.model.getColumnName());
     kanbanColumn.setPrevColumnId(this.model.getLastColumn().getId());

     DataService.getStoreManager().getKanbanStore().createColumn(kanbanColumn).then(insertedColumn=>{
        this.model.addColumn(insertedColumn);
     });
  }

  public isOpen():boolean{
    return this.model.getProject() != null;
  }

  public isDefaultColumnOpen():boolean{
    return this.defaultColumnOpen;
  }

  public toggleOpenDefautlColumn():void{
    this.defaultColumnOpen = !this.defaultColumnOpen;
  }

  // TODO: całe dodwanie przenieść w inne miejsce
  public addNewTask(column:KanbanColumn){
    const task = this.prepareTaskToInsert();
    // task.setOrderPrev(this.getLastTask(this.model.getProject()).getId());
    const data = new InsertTaskData(task, column, this.model.getProject().getId());
    DataService.getStoreManager().getTaskStore().createTask(data).then(result=>{
      this.updateTasksAfterInsert(result, column);

    });
    this.closeAddingNewTask();
  }

  private updateTasksAfterInsert(result: InsertTaskResult, column: KanbanColumn) {
    // TODO: sprawdzić=, czy będzie można pominąć dodawanie do projektu
    this.model.getProject().addTask(result.insertedTask);
    column.getKanbanTasks().push(result.insertedKanbanTask);
     // TODO: zrobić zaktualizowanie zmienionych obiektóœ
  }

  private prepareTaskToInsert() {
    const task = new Task(this.model.getNewTaskName());
    task.setProject(this.model.getProject());
    return task;
  }



  public closeAddingNewTask(){
      this.model.setColumnAddingOpen(null);
      this.model.setNewTaskName("");
  }

  public handleAddingKeyUp(event:KeyboardEvent){
    // TODO: obsługa klawiszy
  }

  public onAddKanbanTaskClick(column:KanbanColumn){
    this.model.setColumnAddingOpen(column);
    FocusHelper.focus(this.getNewTaskInputId(column));
  }

  private getNewTaskInputId(column:KanbanColumn){
    return "#new_task_input_" + column.getId();
  }

  public onTaskEdit(task:Task){
    // TODO: obsługa edytowania
  }

  public onTaskDelete(task:Task){
    // TODO: usuwanie zadania
  }
}
