import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { Status } from 'app/models/status';
import { Subtask } from 'app/models/subtask';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  constructor() { }

  @Output() details: EventEmitter<Task> = new EventEmitter();
  
  // TODO: przenieść do modelu
  public project: Project = new Project(); 
  // TODO: zmienić nazwę
  private menuForLabel: Task;

  ngOnInit(): void {
    let task1 = new Task("Jeden", "Coś tam", Status.CANCELED);
    task1.setEndDate(new Date());
    let subtask1 = new Subtask("Podzadanie 1","Opisik",Status.STARTED);
    let subtask2 = new Subtask("Podzadanie 2", "Coś", Status.ENDED);
    let subtask3 = new Subtask("Podzadanie 3", "Coś 2", Status.AWAITING);
    task1.addSubtask(subtask1);
    task1.addSubtask(subtask2);
    task1.addSubtask(subtask3);
    let task2 = new Task("Dwa", "Dłuższy opis", Status.STARTED);
    this.project.addTask(task1);
    this.project.addTask(task2);
  }

  public setProject(project:Project):void{
    this.project = project;
  }

  filterTasks(filterValue:string){
    // TODO: zrobić filtrowanie zadań
  }

  createTaskClick(){
    // TODO: otworzyć tworzenie nowego zadania
  }

  taskMenuClick(mouseEvent: MouseEvent, task:Task){
    // TOOD: coś tutaj zrobić. Popatrzeć na projekty
    this.menuForLabel = task;
    mouseEvent.preventDefault();
  }


  editTask(){
    // TOOD: edycja zadania
    console.log("Kliknięto tutaj");
    this.details.emit(this.menuForLabel);
    this.menuForLabel = null;
  }

  removeTask(){
    // TOOD: usuwanie zadania

    this.menuForLabel = null;
  }

  getFinishedSubtasks(task:Task){
    let finishedSubtask = task.getSubtasks().filter(x=>x.getStatus()==Status.ENDED);
    return finishedSubtask.length;
  }

  getEndDateText(task:Task){
    // TODO: zrobić odpowiedni format
    return task.getEndDate().toDateString();
  }

  getSubtasksList(task:Task){
    // TODO: spróbować zrobić tooltipa z html
    let text = "";
    task.getSubtasks().forEach(subtask=>{
      text += subtask.getName();
      text += "\n";
      text += "\n";
    });
    return text;
  }
}
