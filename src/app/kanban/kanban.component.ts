import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { KanbanModel } from './kanban.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { DataService } from 'app/data.service';
import { KanbanColumn} from 'app/models/kanban';
import { FocusHelper } from 'app/common/view_helper';
import { TaskItemInfo } from 'app/tasks/common/task.item.info';
import { Status } from 'app/models/status';
import { InsertTaskData } from 'app/data/common/models/insert.task.data';
import { InsertTaskResult } from 'app/data/common/models/insert.task.result';

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
    DataService.getStoreManager().getKanbanColumnStore().getByProject(project.getId()).then(columns=>{
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
    console
    const currentColumn = this.model.getColumnById(Number.parseInt(column));
    const previousTask = this.model.getTaskByIndex(previousIndex, currentColumn.getId());
    const currentTask = this.model.getTaskByIndex(currentIndex, currentColumn.getId());
    DataService.getStoreManager().getKanbanTaskStore().move(previousTask, currentTask, previousIndex>currentIndex).then(updatedTask=>{
      this.model.updateTasks(updatedTask, currentColumn.getId());
    });
  }

  private moveTaskToColumn(previousColumnId: string, currentColumnId:string, previousIndex: number, currentIndex: number){
      console.log("MoveTaskToColumn");
      const previousColumn = this.model.getColumnById(Number.parseInt(previousColumnId));
      const currentColumn = this.model.getColumnById(Number.parseInt(currentColumnId));
      const previousTask = previousColumn.getKanbanTasks()[previousIndex];
      const currentTask = currentColumn.getKanbanTasks()[currentIndex];
      DataService.getStoreManager().getKanbanTaskStore().changeContainer(previousTask, currentTask, currentColumn.getId()).then(updatedTask=>{
        console.log("Zaktualizowane ");
        console.log(updatedTask);
        // TODO: spróbować to zrobić w kodzie listy

        this.model.updateTasks(updatedTask, previousColumn.getId());
        this.model.updateTasks(updatedTask, currentColumn.getId());
        // this.model.removeTasks(previousTask, previousColumn.getId());
        // this.model.insertTask(previousTask, currentColumn.getId());

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

     DataService.getStoreManager().getKanbanColumnStore().create(kanbanColumn).then(insertedColumn=>{
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
