import { Component, OnInit } from '@angular/core';

import { Task } from 'app/models/task';
import { LocalDatabase } from 'app/data/local/database';
import { DatabaseTest } from 'app/data/test/database_test';


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

    let databaseTest = new DatabaseTest();
    // databaseTest.addProject();
    // databaseTest.updateProject();
    // databaseTest.removeProject();
    // databaseTest.addTasksToProject();
    // databaseTest.removeTask();
    // databaseTest.removeAllProject();
    databaseTest.getAllProjects();
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
