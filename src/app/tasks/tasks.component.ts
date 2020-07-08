import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { Status } from 'app/models/status';
import { TasksModel } from './model';
import { DataService } from 'app/data.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogHelper } from 'app/common/dialog';


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
  public status = Status;

  ngOnInit(): void {}

  public setProject(project:Project):void{
    this.model.setProject(project);
  }

  public addTask(task:Task){
    if(task.getProjectID()==this.model.getProject().getId()){
      this.model.addTask(task);
    }
  }

  public onCreateTaskClick(){
    const task = new Task();
    // TODO: usunąć projekt edycji
    task.setProject(this.model.getProject());
    this.details.emit(task);
  }

  public onTaskMenuClick(mouseEvent: MouseEvent, task:Task){
    mouseEvent.stopPropagation();
    this.model.setTaskWithOpenMenu(task);
    // TODO: wymyślić, w jakis sposbó zaznaczyć element 
  }


  public onEditTask(){
    // TODO: można spróbować pobrać z bazy i przekazać dalej. Może rozwiązać problem pracy na jednym obiekcie
    this.details.emit(this.model.getTaskWithOpenMenu());
    this.model.setTaskWithOpenMenu(null);
  }

  public onRemoveTask(){
    const message = "Czy na pewno usunąć zadanie?";
    DialogHelper.openDialog(message, this.dialog).subscribe(result=>{
      if(result){
        this.removeTask();
      }
    });
  }

  private removeTask():void{
    const taskId = this.model.getTaskWithOpenMenu().getId();
    DataService.getStoreManager().getTaskStore().removeTask(taskId).then(()=>{
      this.model.removeTask(this.model.getTaskWithOpenMenu());
      this.removeEvent.emit(taskId);
      this.model.setTaskWithOpenMenu(null);
    });
  }

  public getEndDateText(task:Task){
    // TODO: zrobić odpowiedni format
    return task.getEndDate().toDateString();
  }

  // TODO: przenieść to do html
  public getSubtasksList(task:Task){
    let text = "<ul class='tooltip-list'>";
    task.getSubtasks().forEach(subtask=>{
      text += "<li>"+ subtask.getName()+"</li>"
    });
    text+= "</ul>";
    return text;
  }
}
