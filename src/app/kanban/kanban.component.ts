import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { KanbanModel } from './kanban.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { DataService } from 'app/data.service';

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
      this.moveTaskToColumn(event.previousContainer.id, event.container.id, event.previousIndex, event.currentIndex);
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  private changeTasksOrder(column: string, previousIndex: number, currentIndex: number){
    // TODO: zmiana kolejnośći
  }

  private moveTaskToColumn(previousColumn: string, currentColumn:string, previousIndex: number, currentIndex: number){
    // TODO: przeniesienie do kolumny
  }
  
  public closeView(){
    this.closeEvent.emit();
  }

}
