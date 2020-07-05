import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Status } from 'app/models/status';
import { Project } from 'app/models/project';
import { Tag } from 'app/models/tag';
import { Subtask } from 'app/models/subtask';
import { TaskDetails } from './model';
import * as $ from 'jquery';
import { Task } from 'app/models/task';
import { DataService } from 'app/data.service';
import { TaskTagsModel } from 'app/data/common/models';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {
  // TODO: refaktoryzacja
  public status = Status;

  @Output() closeEmitter: EventEmitter<null> = new EventEmitter();
  @Output() saveEmitter: EventEmitter<Task> = new EventEmitter();
  @Output() labelsManager: EventEmitter<null> = new EventEmitter();
  public model: TaskDetails = new TaskDetails();

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
      this.model.setUpdateMode(task.getId()!=null);
      DataService.getStoreManager().getTaskStore().getTaskById(task.getId()).then(loadedTask=>{
        this.model.setTask(task);
        $('#task-id').focus();
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

  // TODO: zmienić nazwę na otwarcie czy coś
  public addNewSubtask(){
    this.model.setSubtaskEditing(true);
    this.model.setEditedSubtask(null);
    // TODO: opisać to w dokumencie
    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      $('#subtask').focus();
    },0); 
    
  }

  public chooseTag(tag:Tag){
    if(this.model.isUpdateMode()){
      let model = new TaskTagsModel(this.model.getTask().getId(), tag.getId());
      // TODO: przerobić tę metodę, aby nie wykorzystywała modelu tylko id
      DataService.getStoreManager().getTagStore().connectTaskAndTag(model).then(()=>{
        this.model.getTask().addTag(tag);
      });
    } else {
      this.model.getTask().addTag(tag);
    }
  }

  public removeLabel(tag:Tag){
    if(this.model.isUpdateMode()){
      // TODO: przetestować to
      DataService.getStoreManager().getTagStore().removeTagFromTask(this.model.getTask().getId(), tag.getId()).then(()=>{
        this.model.getTask().removeTag(tag);
        this.model.setEditedSubtask(null);

      });
    } else {
      this.model.getTask().removeTag(tag);
      this.model.setEditedSubtask(null);
    }
  }

  public editSubtask(subtask:Subtask){
    this.model.setEditedSubtask(subtask);
    setTimeout(()=>{
      $('#subtask-name-input_' + subtask.getId()).focus();
    },0);
    this.model.setSubtaskEditing(false);
  }

  public removeSubtask(subtask:Subtask){
    // TODO: chyba usunąć to z bazy danych
    if(this.model.isUpdateMode()){
      DataService.getStoreManager().getSubtaskStore().removeSubtask(subtask.getId()).then(()=>{
        this.model.getTask().removeSubtask(subtask);
      });
    } else {
      this.model.setEditedSubtask(null);
    }
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
    if(this.model.isUpdateMode()){
      DataService.getStoreManager().getSubtaskStore().updateSubtask(subtask).then(updatedSubtask=>{
        this.model.setEditedSubtask(null);
      })
    } else{
      this.model.setEditedSubtask(null);
    }
  }

  public cancelAddingSubtask(){
    this.model.setSubtaskEditing(false);
  }

  // TODO: refaktoryzacja
  public saveNewSubtask(){
    const textField = $('#subtask');
    const subtaskName = textField.val();    
    const subtask = new Subtask(subtaskName,null, Status.STARTED);
    // TODO: zapis do bazy danych
    if(this.model.isUpdateMode()){
      // w przypadku dodawania nowego zadania podzadania zostaną zapisane wraz z zadaniem
      DataService.getStoreManager().getSubtaskStore().createSubtask(subtask).then(insertedSubtask=>{
        this.model.getTask().addSubtask(insertedSubtask);
      });
    } else {
      this.model.getTask().addSubtask(subtask);
    }
    textField.val('');
    this.model.setSubtaskEditing(false); // TODO: chyba
  }

  public saveTask(){
    // TODO: zrobić zapisywanie - dobrze się będzie trzeba zastanowić jak powinno przebiegać
    if(this.model.isUpdateMode()){
      // TODO: prawdopodobnie taka sytuacja nie wystapi
    } else { 
      DataService.getStoreManager().getTaskStore().createTask(this.model.getTask()).then(insertedTask=>{
        // this.model.getSelectedProject().addTask(insertedTask);
        // TODO: byc może tutaj powinno być informacja o zamknięcu i być może wstawieniu nowego zadania
        // TODO: wyświetlniee komunikatu o powodzeniu zapisu
        this.closeEmitter.emit();
      });
    }
  }

  public updateTask(){
    // TODO: powinniśmy sprawdzać, czy są jakiekolwiek zmiany
    console.log("Aktualizacja zadania");
    if(this.model.isUpdateMode()) {
      DataService.getStoreManager().getTaskStore().updateTask(this.model.getTask()).then(()=>{
        // TODO: może tutaj można coś wstawić
      });
    }
  }

  public close(){
    // TODO: można zrobić jakiś komunikat
    console.log("task details");
    this.closeEmitter.emit();
  }

  public openLabelsManager(){
    this.labelsManager.emit();
  }

  public handleKeysOnNewSubtaskInput(event:KeyboardEvent){
    if(event.keyCode == 13){  // enter
      console.log("Wykonywanie tego");
      this.saveNewSubtask();
    } 
    if(event.keyCode == 27){ // esc
      this.cancelAddingSubtask();
    }
  }

  public handleKeysOnEditSubtask(event:KeyboardEvent, subtask:Subtask){
    if(event.keyCode == 13){  // enter
      this.acceptEditing(subtask);
    } 
    if(event.keyCode == 27){ // esc
      this.model.setEditedSubtask(null);
    }
  }
}
