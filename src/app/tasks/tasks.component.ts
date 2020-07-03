import { Component, OnInit } from '@angular/core';

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
  
  public project: Project = new Project(); 

  ngOnInit(): void {
    let task1 = new Task("Jeden", "Coś tam", Status.CANCELED);
    task1.setEndDate(new Date());
    let subtask1 = new Subtask("Podzadanie 1","Opisik",Status.STARTED);
    task1.addSubtask(subtask1);
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

  taskMenuClick(mouseEvent: MouseEvent, project:Project){
    // TOOD: coś tutaj zrobić. Popatrzeć na projekty
  }

  editTask(){
    // TOOD: edycja zadania
  }

  removeTask(){
    // TOOD: usuwanie zadania
  }

  onMouseEnterDescription(task:Task){
    // TODO: pokazać dymek z opisem
    console.log(task.getDescription());
  }

  onMouseLeaveDescription(task:Task){
    // TODO: zamknąć dymek z opisem
    console.log("Zamknięto opis zadania");
  }

  onMouseEnterEndDate(task:Task){
    // TODO: pokazać dymek z datą końcową
    console.log(task.getEndDate());
  }

  onMouseLeaveEndDate(task:Task){
    // TODO: zamknąć dymek z datą końcową
    console.log("Zamknięto datę końcową");
  }

  onMouseEnterSubtasks(task:Task):void{
    // TODO: otworzyć dymek z podzadaniami
    console.log(task.getSubtasks());
  }

  onMouseLeaveSubtasks(task:Task):void{
    // TODO: zamknać dymek z podzadaniami
    console.log("Zamknięto podzadania")
  }
}
