import { Component, OnInit, Output, EventEmitter, ɵsetCurrentInjector, ComponentFactoryResolver } from '@angular/core';
import { KanbanModel } from './kanban.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { DataService } from 'app/data.service';
import { KanbanColumn, KanbanTask } from 'app/models/kanban';
import { FocusHelper } from 'app/common/view_helper';
import { last } from 'rxjs/operators';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit {

  @Output() closeEvent: EventEmitter<null> = new EventEmitter();

  private model: KanbanModel = new KanbanModel();
  private defaultColumnOpen = true;

  constructor() { }

  ngOnInit(): void {
  }

  public getModel(){
    return this.model;
  }

  public openProject(project:Project){
    this.model.clearColumns();
    this.model.setProject(project);
      DataService.getStoreManager().getKanbanStore().getColumnsByProject(project.getId()).then(columns=>{
        columns.forEach(column=>{
          this.model.addColumn(column);
        })
      })
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
    const kanbanTasksToUpdate = currentColumn.moveKanbanTasks(previousIndex, currentIndex);
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
    toUpdate = toUpdate.concat(previousColumn.removeKanbanTask(previousTask));
    toUpdate = toUpdate.concat(currentColumn.insertKanbanTask(previousTask, currentIndex));
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
    const task = new Task(this.model.getNewTaskName());
    task.setProject(this.model.getProject());
    task.setOrderPrev(this.getLastTask(this.model.getProject()).getId());

    DataService.getStoreManager().getTaskStore().createTask(task).then(createdTask=>{
      this.insertKanbanTask(createdTask, column).then((kanbanTask)=>{
        this.model.getProject().addTask(createdTask);
        // TODO: jeżeli będzie dołączanie zadania na poczatek, będzie to trzeba zmienić
        column.getKanbanTasks().push(kanbanTask);
      });
    });

    this.closeAddingNewTask();
  }

  // TODO: podobna metoda jest w task.adding.controller.ts
  private insertKanbanTask(task:Task, column: KanbanColumn):Promise<KanbanTask>{
    const kanbanStore = DataService.getStoreManager().getKanbanStore();
    const lastTaskInColumn = column.getKanbanTasks()[column.getKanbanTasks().length - 1];
    const kanbanTask = this.createKanbanTask(task, column, lastTaskInColumn);
    return kanbanStore.createKanbanTask(kanbanTask).then(createdKanbanTask=>{
      if(lastTaskInColumn){
        this.updatePreviousKanbanTask(lastTaskInColumn, createdKanbanTask);
      }
      return Promise.resolve(createdKanbanTask);
    });
  }

  private createKanbanTask(task:Task, column:KanbanColumn, lastKanbanTask: KanbanTask){
    const kanbanTask = new KanbanTask();
    kanbanTask.setColumnId(column.getId());
    kanbanTask.setTaskId(task.getId());
    if(lastKanbanTask){
      kanbanTask.setPrevTaskId(lastKanbanTask.getId());
    }
    return kanbanTask;
  }

  private updatePreviousKanbanTask(lastKanbanTask: KanbanTask, createdTask: KanbanTask) {
    lastKanbanTask.setNextTaskId(createdTask.getId());
    return DataService.getStoreManager().getKanbanStore().updateKanbanTask(lastKanbanTask);
}

  private getLastTask(project:Project){
    return project.getTasks()[project.getTasks().length-1];
  }

  public closeAddingNewTask(){
      this.model.setColumnAddingOpen(null);
      this.model.setNewTaskName("");
  }

  public handleAddingKeyUp(event:KeyboardEvent){
    // TODO
  }

  public onAddKanbanTaskClick(column:KanbanColumn){
    this.model.setColumnAddingOpen(column);
    FocusHelper.focus(this.getNewTaskInputId(column));
  }

  private getNewTaskInputId(column:KanbanColumn){
    return "#new_task_input_" + column.getId();
  }
}
