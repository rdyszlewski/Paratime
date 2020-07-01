import { Component, OnInit } from '@angular/core';
import { DatabaseTest } from 'app/data/test/database_test';
import { LocalDatabase } from 'app/data/local/database';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.configureDexie();
  }

  private configureDexie(){
    this.deleteDatabase(); // TODO: po testowaniu sunąć to 

    let databaseTest = new DatabaseTest();
    let project1 =databaseTest.createProjectWithName("Projekt 1");
    let project2 = databaseTest.createProjectWithName("Project 2");
    databaseTest.insertProject(project1);
    databaseTest.insertProject(project2);
    // databaseTest.updateProject();
    // databaseTest.removeProject();
    // databaseTest.addTasksToProject();
    // databaseTest.removeTask();
    // databaseTest.removeAllProject();
    // databaseTest.getAllProjects();
  }

  private deleteDatabase(){
    var database = new LocalDatabase();
    database.delete().then(()=>{
      console.log("Usunięto bazę danych");
    })
  }

}
