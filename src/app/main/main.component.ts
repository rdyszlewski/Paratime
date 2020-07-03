import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseTest } from 'app/data/test/database_test';
import { LocalDatabase } from 'app/data/local/database';
import { ProjectDetailsComponent } from 'app/project-details/project-details.component';
import { TaskDetailsComponent } from 'app/task-details/task-details.component';
import { Project } from 'app/models/project';
import { ProjectsComponent } from 'app/projects/projects.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  @ViewChild(ProjectDetailsComponent) 
  private projectDetailsComponent: ProjectDetailsComponent;

  @ViewChild(TaskDetailsComponent) 
  private taskDetailsComponent: TaskDetailsComponent;
  
  @ViewChild(ProjectsComponent)
  private projectsComponent: ProjectsComponent;

  // TODO: zastanowić się, jak to ładnie uporządkować
  projectsOpen = true;
  projectsDetailsOpen = false;
  tasksOpen = true;
  tasksDetailsOpen = false;

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
  }

  private deleteDatabase(){
    var database = new LocalDatabase();
    database.delete().then(()=>{
      console.log("Usunięto bazę danych");
    })
  }

  openProjectDetails(project){
    this.projectsDetailsOpen = true;
    this.projectDetailsComponent.setProject(project);
    // TODO: w jakiś sposób przekazać dane do komonentu
  }

  closeProjectDetails(){
    this.projectsDetailsOpen = false;
  }

  afterSaveProject(project:Project){
    // TODO: alternatywą będzie ponowne wyszukanie wszystkim projektów
    // TODO: nie można tego robić w ten sposób, ponieważ przy aktualizacji dodaje do listy
    this.projectsComponent.addProject(project);
  }
}
