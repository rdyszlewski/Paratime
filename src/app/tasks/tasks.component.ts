import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { Status } from 'app/models/status';
import { Subtask } from 'app/models/subtask';
import { TasksModel } from './model';
import { DataService } from 'app/data.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'app/dialog/dialog.component';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  constructor(public dialog:MatDialog) { }

  @Output() details: EventEmitter<Task> = new EventEmitter();
  @Output() removeEvent: EventEmitter<number> = new EventEmitter();
  
  public model: TasksModel = new TasksModel();

  ngOnInit(): void {
    
  }

  private mockDate(){
    let task1 = new Task("Jeden", "Coś tam", Status.CANCELED);
    task1.setEndDate(new Date());
    let subtask1 = new Subtask("Podzadanie 1","Opisik",Status.STARTED);
    let subtask2 = new Subtask("Podzadanie 2", "Coś", Status.ENDED);
    let subtask3 = new Subtask("Podzadanie 3", "Coś 2", Status.AWAITING);
    task1.addSubtask(subtask1);
    task1.addSubtask(subtask2);
    task1.addSubtask(subtask3);
    let task2 = new Task("Dwa", "Dłuższy opis", Status.STARTED);
    this.model.addTask(task1);
    this.model.addTask(task2);
  }

  public setProject(project:Project):void{
    this.model.setProject(project);
  }

  filterTasks(filterValue:string){
    this.model.filterTasks(filterValue);
  }

  createTaskClick(){
    const task = new Task();
    task.setProject(this.model.getProject());
    this.details.emit(task);
  }

  taskMenuClick(mouseEvent: MouseEvent, task:Task){
    // TOOD: coś tutaj zrobić. Popatrzeć na projekty
    this.model.setTaskWithOpenMenu(task);
    mouseEvent.preventDefault();
  }


  editTask(){
    this.details.emit(this.model.getTaskWithOpenMenu());
    this.model.setTaskWithOpenMenu(null);
  }

  private removeTask():void{
    const taskId = this.model.getTaskWithOpenMenu().getId();
    DataService.getStoreManager().getTaskStore().removeTask(taskId).then(()=>{
      this.model.removeTask(this.model.getTaskWithOpenMenu());
      // TODO: pomyśleć jak to można rozwiązać inaczej. Terz może być problem, przy szybkim otwieraniu menu
      this.model.setTaskWithOpenMenu(null);
      this.removeEvent.emit(taskId);
    });
  }

  public getFinishedSubtasks(task:Task){
    let finishedSubtask = task.getSubtasks().filter(x=>x.getStatus()==Status.ENDED);
    return finishedSubtask.length;
  }

  getEndDateText(task:Task){
    // TODO: zrobić odpowiedni format
    return task.getEndDate().toDateString();
  }

  getSubtasksList(task:Task){
    let text = "<ul class='tooltip-list'>";
    task.getSubtasks().forEach(subtask=>{
      text += "<li>"+ subtask.getName()+"</li>"
    });
    text+= "</ul>";
    return text;

  }

  private openDialog(){
    const dialogRef = this.dialog.open(DialogComponent, 
      {width:"350px", data: "Czy na pewno usunąć zadanie?"});
    return dialogRef.afterClosed();
  }

  public onRemoveTask(){
    this.openDialog().subscribe(result=>{
      if(result){
        this.removeTask();
      }
    });
  }

  // TODO: pomysleć, jak to zrobić poprawnie
  public addTask(task:Task){
    if(task.getProjectID()==this.model.getProject().getId()){
      this.model.addTask(task);
    }
  }
}
