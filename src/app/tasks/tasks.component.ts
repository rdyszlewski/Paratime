import { Component, OnInit } from '@angular/core';
import { Project } from 'app/models/project';
import { Subtask } from 'app/models/subtask';
import { Status } from 'app/models/status';

import { Task } from 'app/models/task';
import { LocalDatabase } from 'app/data/local/database';
import { Tag } from 'app/models/tag';
import { TaskTagsModel } from 'app/data/common/models';
import { LocalDataSource } from 'app/data/local/source';
import { resourceUsage } from 'process';


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
    // var database = new LocalDatabase();
    console.log("CZy to się wykonuje");
    let source = new LocalDataSource();
   

    this.insertProjectAndTask(source);
    this.insertTags(source);
    this.insertTaskTags(source);
    this.removeTaskTags(source);
  }

  private removeTaskTags(source: LocalDataSource) {
    source.getTaskTagRepository().remove(new TaskTagsModel(1, 1)).then((result) => {
      source.getTaskTagRepository().findByTaskId(1).then(entries => {
        console.log("Pozostałe wpisy tagów zadań");
        console.log(entries);
      });
    });
  }

  private insertProjectAndTask(source: LocalDataSource) {
    let project = new Project();
    project.setName("Projekt 1");
    project.setDescription("To jest przykładowy projekt");
    project.setStatus(Status.AWAITING);

    let task1 = new Task();
    task1.setName("Zadanie");
    task1.setDescription("To jest zadanie");
    task1.setStatus(Status.AWAITING);
    task1.setProject(project);

    source.getProjectRepository().insertProject(project).then(result => {
      console.log(result);
      project = result;
      task1.setProjectID(result['id']);
      source.getTaskRepository().insertTask(task1).then((task) => {
        console.log(task);
      }).then(() => {
        source.getTaskRepository().removeTasksByProject(1).then(() => {
          source.getTaskRepository().findTaskById(1).then(result => {
            console.log(result);
          });
        });
      });
    });
  }

  private insertTaskTags(source: LocalDataSource) {
    let entry1 = new TaskTagsModel(1, 1);
    let entry2 = new TaskTagsModel(1, 2);

    source.getTaskTagRepository().insert(entry1).then(result => {
      console.log("Wstawiono tagi zadania");
      console.log(result);

      source.getTaskTagRepository().insert(entry2).then(result => {
        console.log("Wstawiono tagi zadania");
        console.log(result);
      });
    });

  }

  private insertTags(source: LocalDataSource) {
    let tag1 = new Tag();
    tag1.setName("Pierwszy tag");

    let tag2 = new Tag();
    tag2.setName("Drugi tag");

    return source.getTagRepository().insertTag(tag1).then(result => {
      console.log("Wstawiono tag ");
      console.log(result);

      return source.getTagRepository().insertTag(tag2).then(result => {
        console.log("Wstawiono tag");
        console.log(result);
      });
    });

    
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

  // private insertTaskTags(database:LocalDatabase){
  //   let entry1 = new TaskTagsModel(1, 1);
  //   let entry2 = new TaskTagsModel(1, 2);

  //   database.getTaskTagsTable().put(entry1);
  //   database.getTaskTagsTable().put(entry2);
  // }

  private loadTaskTags(database:LocalDatabase){
    console.log("Tagi zadań");
    let entries = database.getTaskTagsTable().toArray();
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
