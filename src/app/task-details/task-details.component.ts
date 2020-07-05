import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Status } from 'app/models/status';
import { Project } from 'app/models/project';
import { Tag } from 'app/models/tag';
import { Subtask } from 'app/models/subtask';
import { TaskDetails } from './model';
import * as $ from 'jquery';
import { Task } from 'app/models/task';
import { DataService } from 'app/data.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {

  public status = Status;

  @Output() closeEmitter: EventEmitter<null> = new EventEmitter();
  @Output() saveEmitter: EventEmitter<Task> = new EventEmitter();
  @Output() labelsManager: EventEmitter<null> = new EventEmitter();
  public model: TaskDetails = new TaskDetails();
  

  // public task:Task = new Task();
  // public projects:Project[] = [];
  // public tags: Tag[] = [];
  // TODO: utworzyć model, zaznaczyć wybrany model

  constructor() { }

  ngOnInit(): void {
    this.init();
  }

  private init(){
    DataService.getStoreManager().getProjectStore().getAllProjects().then(projects=>{
      this.model.setProjects(projects);
    });

    this.loadLabels();
  }

  public loadLabels(){
    DataService.getStoreManager().getTagStore().getAllTags().then(labels=>{
      this.model.setTags(labels);
      this.repairTaskLabels(labels);
      
      
      // TOOD: sprawdzenie i wyrzucenie tych etykiet, których nie ma 
    });
  }

  // TODO; poprawić to, aby nie traciło kolejności
  private repairTaskLabels(labels:Tag[]){
    let toRemove = [];
    this.model.getTask().getTags().forEach(label=>{
      const matchingLabels = labels.filter(x=>x.getId()==label.getId());
      if(matchingLabels.length==1){
        label.setName(matchingLabels[0].getName());
      } else if(matchingLabels.length == 0){
        toRemove.push(label);
      }
    });
    toRemove.forEach(label=>{
      this.model.getTask().removeTag(label);
    });
  }

  private mockData(){
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

     // let subtask1 = new Subtask("Podzadanie 1", "Jakiś opis", Status.ENDED);
    // let subtask2 = new Subtask("Podzadanie 2", "Jakiś opis", Status.STARTED);
    // this.model.getTask().addSubtask(subtask1);
    // this.model.getTask().addSubtask(subtask2);

    // this.model.getTask().setProject(project2);
    // this.model.getTask().setName("Oejeju");
    // this.model.getTask().setStatus(Status.STARTED);
  }

  public setTask(task:Task){
    if(task){
      DataService.getStoreManager().getTaskStore().getTaskById(task.getId()).then(loadedTask=>{
        this.model.setTask(task);
      });
    }

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
    this.model.setSubtaskEditing(true);
    this.model.setEditedSubtask(null);
    // TODO: opisać to w dokumencie
    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      $('#subtask').focus();
    },0); 
    
  }

  public chooseTag(tag:Tag){
    this.model.getTask().addTag(tag);
  }

  public removeLabel(tag:Tag){
    // TODO: zrobić usuwanie z bazy danych
    this.model.getTask().removeTag(tag);
  }

  public editSubtask(subtask:Subtask){
    // TODO: uzupełnić
    this.model.setEditedSubtask(subtask);
    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      $('#subtask-name-input_' + subtask.getId()).focus();
    },0);
    this.model.setSubtaskEditing(false);
  }

  public removeSubtask(subtask:Subtask){
    // TODO: chyba usunąć to z bazy danych
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
    const textField = $('#subtask-name-input-' + subtask.getId());
    subtask.setName(textField.val());
    // TODO: zrobić zapisywanie do bazy danych
    this.model.setEditedSubtask(null);
  }

  public cancelAddingSubtask(){
    this.model.setSubtaskEditing(false);
  }

  public saveNewSubtask(){
    // TODO: pobrać wartość z pola, utworzyć zadanie, zapisać do bazy danych (chyba), wspisać na listę
    const textField = $('#subtask');
    const subtaskName = textField.val();    
    const subtask = new Subtask(subtaskName,null, Status.STARTED);
    // TODO: zapis do bazy danych
    this.model.getTask().addSubtask(subtask);
    textField.val('');
    this.model.setSubtaskEditing(false); // TODO: chyba
  }

  public saveTask(){
    // TODO: zrobić zapisywanie - dobrze się będzie trzeba zastanowić jak powinno przebiegać
  }

  public close(){
    // TODO: można zrobić jakiś komunikat
    console.log("task details");
    this.closeEmitter.emit();
  }

  public openLabelsManager(){
    this.labelsManager.emit();
  }
}
