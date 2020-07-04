import { Component, OnInit } from '@angular/core';
import { Status } from 'app/models/status';
import { Project } from 'app/models/project';
import { Tag } from 'app/models/tag';
import { Subtask } from 'app/models/subtask';
import { TaskDetails } from './model';
import * as $ from 'jquery';
import { strict } from 'assert';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {

  public status = Status;

  public model: TaskDetails = new TaskDetails();

  // public task:Task = new Task();
  // public projects:Project[] = [];
  // public tags: Tag[] = [];
  // TODO: utworzyć model, zaznaczyć wybrany model

  constructor() { }

  ngOnInit(): void {
    let project1 = new Project("Projekt 1");
    project1.setId(1);
    let project2 = new Project("Projekt 2");
    project2.setId(2);
    let project3 = new Project("Projekt 3");
    project3.setId(3);
    this.model.getProjects().push(project1);
    this.model.getProjects().push(project2);
    this.model.getProjects().push(project3);


    let tag1 = new Tag("Pierwszy tag");
    tag1.setId(1);
    let tag2 = new Tag("Drugi tag");
    tag2.setId(2);
    
    this.model.getTags().push(tag1);
    this.model.getTags().push(tag2);

    this.model.getTask().addTag(tag1);

    let subtask1 = new Subtask("Podzadanie 1", "Jakiś opis", Status.ENDED);
    let subtask2 = new Subtask("Podzadanie 2", "Jakiś opis", Status.STARTED);
    this.model.getTask().addSubtask(subtask1);
    this.model.getTask().addSubtask(subtask2);

    // this.model.getTask().setProject(project2);
    this.model.getTask().setName("Oejeju");
    this.model.getTask().setStatus(Status.STARTED);
  }

  public getStatus(){
    return this.getStatusValue(this.model.getTask().getStatus());
  }

  // TODO: przenieść to do innej klasy, ponieważ ProjectDetailsComponent również z tego korzysta
  private getStatusValue(status:Status): string{
    switch(status){
      case Status.STARTED:
        return 'started';
      case Status.ENDED:
        return 'ended';
      case Status.CANCELED:
        return 'canceled';
      case Status.AWAITING:
        return 'awaiting';
      default:
        return 'awaiting';
    }
  }

  public addNewSubtask(){
    this.model.toggleSubtaskEditing();
    // TODO: opisać to w dokumencie
    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      $('#subtask').focus();
    },0); 
    
    
    // TODO: ustawić focus na polu tekstowym
  }

  public chooseTag(tag:Tag){
    this.model.getTask().addTag(tag);
  }

  public removeLabel(tag:Tag){
    // TODO: zrobić usuwanie z bazy danych i z listy
    console.log("Usuwam etykietę");
    this.model.getTask().removeTag(tag);
  }

  public editSubtask(subtask:Subtask){
    // TODO: uzupełnić
    this.model.setEditedSubtask(subtask);
    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      $('#subtask-name-input_' + subtask.getId()).focus();
    },0);
    this.model.toggleSubtaskEditing();
  }

  public removeSubtask(subtask:Subtask){
    // TODO: uzupełnić
    console.log("Usuwanie podzadania");
    this.model.getTask().removeSubtask(subtask);
  }

  public toggleSubtaskStatus(subtask:Subtask){
    if(subtask.getStatus()== Status.STARTED){
        subtask.setStatus(Status.ENDED);
    } else if(subtask.getStatus()==Status.ENDED){
        subtask.setStatus(Status.STARTED);
    }
  }

  public acceptEditing(subtask:Subtask){
    const textField = $('#subtask-name-input_' + subtask.getId());
    subtask.setName(textField.val());
    // TODO: zrobić zapisywanie do bazy danych
    this.model.setEditedSubtask(null);
  }

  public cancelAddingSubtask(){
    this.model.toggleSubtaskEditing();
  }

  public saveNewSubtask(){
    // TODO: pobrać wartość z pola, utworzyć zadanie, zapisać do bazy danych (chyba), wspisać na listę
    const textField = $('#subtask');
    const subtaskName = textField.val();    
    const subtask = new Subtask(subtaskName,null, Status.STARTED);
    // TODO: zapis do bazy danych
    this.model.getTask().addSubtask(subtask);
    textField.val('');
    this.model.toggleSubtaskEditing();
  }

  public saveTask(){
    
  }

  public close(){
    // TODO: można zrobić jakiś komunikat
  }

  

}
