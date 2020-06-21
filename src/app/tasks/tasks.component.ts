import { Component, OnInit } from '@angular/core';
import { Project } from 'app/models/project';
import { Subtask } from 'app/models/subtask';
import { Status } from 'app/models/status';
import { ProjectType } from 'app/models/project_type';
import Dexie, { DBCoreRangeType } from 'dexie';
import { Task } from 'app/models/task';
import { LocalDatabase } from 'app/data/local/database';
import { Tag } from 'app/models/tag';
import { Local } from 'protractor/built/driverProviders';
import { TaskTagsModel } from 'app/data/common/models';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  constructor() { }

  tasks: Task[]=[];

  ngOnInit(): void {
    this.tasks = [];
    this.configureDexie();
  }

  private configureDexie(){
    this.deleteDatabase(); // TODO: po testowaniu sunąć to 
    var database = new LocalDatabase();
    
    this.insertProject(database);
    this.loadProject(database);

    this.insertTask(database);
    this.loadTask(database);

    this.insertSubtask(database);
    this.loadSubtask(database);

    this.insertTag(database);
    this.loadTag(database);

    this.insertTaskTags(database);
    this.loadTaskTags(database);
  }

  private insertProject(database: LocalDatabase){
    let project = new Project();
    project.setName("Projekt 1");
    project.setDescription("To jest przykładowy projekt");
    project.setStatus(Status.AWAITING);
    
    database.getProjectsTable().put(project);
  }

  private insertTask(database:LocalDatabase){
    let task = new Task();
    task.setName("Zadanie 1");
    task.setDescription("To jest zadanie 1");
    task.setStatus(Status.STARTED);
    task.setPlannedTime(100);

    database.getTasksTable().put(task);
  }

  private insertSubtask(database: LocalDatabase){
    let subtask = new Subtask();
    subtask.setName("Podzadanie 1");
    subtask.setDescription("To jest podzadanie 1");
    subtask.setTaskID(1);
    subtask.setStatus(Status.CANCELED);
    subtask.setProgress(50);

    database.getSubtasksTable().put(subtask);
  }

  private insertTag(database: LocalDatabase){
    let tag = new Tag();
    tag.setName("Tag 1");

    let tag2 = new Tag();
    tag2.setName("Tag 2");

    database.getTagsTable().put(tag);
    database.getTagsTable().put(tag2);
  }

  private insertTaskTags(database:LocalDatabase){
    let entry1 = new TaskTagsModel(1, 1);
    let entry2 = new TaskTagsModel(1, 2);

    database.getTaskTagsTable().put(entry1);
    database.getTaskTagsTable().put(entry2);
  }

  private async loadTaskTags(database:LocalDatabase){
    console.log("Tagi zadań");
    let entries = await database.getTaskTagsTable().toArray();
    console.log(entries);
  }

  private async loadTag(database:LocalDatabase){
    console.log("Tagi");
    let tags = await database.getTagsTable().toArray();
    console.log(tags);
  }

  private async loadSubtask(database:LocalDatabase){
    console.log("Podzadania");
    let subtask = await database.getSubtasksTable().toArray();
    console.log(subtask);
  }

  private async loadTask(database:LocalDatabase){
    console.log("Zadania");
    let task = await database.getTasksTable().toArray();
    console.log(task);
  }
  

  private async loadProject(database:LocalDatabase){
    console.log("Projekty");
    let project = await database.getProjectsTable().toArray();
    console.log(project);
  }

  private deleteDatabase(){
    var database = new LocalDatabase();
    database.delete().then(()=>{
      console.log("Usunięto bazę danych");
    })
  }

  public getTasks(){
    // return this.tasks;
    return [];
  }

}
