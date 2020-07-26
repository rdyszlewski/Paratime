import { Component, OnInit, Output, EventEmitter, ɵsetCurrentInjector, ComponentFactoryResolver } from '@angular/core';
import { KanbanModel } from './kanban.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { DataService } from 'app/data.service';
import { KanbanColumn, KanbanTask } from 'app/models/kanban';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit {

  @Output() closeEvent: EventEmitter<null> = new EventEmitter();

  private model: KanbanModel = new KanbanModel();

  constructor() { }

  ngOnInit(): void {
  }

  public getModel(){
    return this.model;
  }

  public openProject(project:Project){
    this.model.clearColumns();
    this.model.setProject(project);
    console.log("Otwieranie");
      DataService.getStoreManager().getKanbanStore().getColumnsByProject(project.getId()).then(columns=>{
        console.log(columns);
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
      console.log("Przesuwanie do innnej kolumny");
      console.log(event.container);
      console.log(event.previousContainer);
      // TODO: pobranie kolumny po id
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
        console.log(insertedColumn);
        this.model.addColumn(insertedColumn);
     });
  }

  public isOpen():boolean{
    return this.model.getProject() != null;
  }

}
