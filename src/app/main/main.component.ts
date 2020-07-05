import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseTest } from 'app/data/test/database_test';
import { LocalDatabase } from 'app/data/local/database';
import { ProjectDetailsComponent } from 'app/project-details/project-details.component';
import { TaskDetailsComponent } from 'app/task-details/task-details.component';
import { Project } from 'app/models/project';
import { ProjectsComponent } from 'app/projects/projects.component';
import { TasksComponent } from 'app/tasks/tasks.component';
import { Task } from 'app/models/task';
import * as $ from 'jquery';

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

  @ViewChild(TasksComponent)
  private tasksComponent: TasksComponent;

  // TODO: zastanowić się, jak to ładnie uporządkować
  public projectsOpen = true;
  public projectsDetailsOpen = false;
  public tasksOpen = true;
  public tasksDetailsOpen = false;
  public labelsOpen = false;

  private projectsView;
  private projectDetailsView;
  private tasksView;
  private taskDetailsView;
  private labelsView;


  constructor() { }

  ngOnInit(): void {
    this.configureDexie();
    this.projectsView = $("#projects");
    this.projectDetailsView = $("#projects-details");
    this.tasksView = $("#tasks");
    this.taskDetailsView = $('#task-details');
    this.labelsView = $('#labels');

    this.setOriginalWidth();
  }

  private configureDexie(){
    this.deleteDatabase(); // TODO: po testowaniu sunąć to 

    let databaseTest = new DatabaseTest();
    let project1 =databaseTest.createProjectWithName("Projekt 1");
    let project2 = databaseTest.createProjectWithName("Project 2");
    databaseTest.insertProject(project1).then(insertedProject=>{
      let task1 = databaseTest.createTask("Zadanie 1");
      let task2 = databaseTest.createTask("Zadanie 2");
      databaseTest.insertTasks(task1, task2, insertedProject);
    });
    databaseTest.insertProject(project2);
  }

  private deleteDatabase(){
    var database = new LocalDatabase();
    database.delete().then(()=>{
      console.log("Usunięto bazę danych");
    })
  }

  public openProjectDetails(project){
    this.projectDetailsComponent.setProject(project);
    this.projectsDetailsOpen = true;
    this.tasksDetailsOpen = false;

    this.setWidthOnProjectViewOpen();
  }

  // TODO: wymyślić jakiś sprytniejszy plan wstawiania szerokości
  // TODO: może nazwać jakoś poszczególne stany, i przygotować odgórnie ustawienia
  private setWidthOnProjectViewOpen(){
    this.tasksView.width('20%');
    this.projectsView.width('20%');
    this.projectDetailsView.width('60%');
  }

  closeProjectDetails(){
    this.projectsDetailsOpen = false;
    this.setOriginalWidth();
  }

  public openTaskDetails(task:Task){
    this.taskDetailsComponent.setTask(task);
    this.tasksDetailsOpen = true;
    this.projectsDetailsOpen = false;

    this.setWidthOnTaskViewOpen();
  }

  private setWidthOnTaskViewOpen(){
    this.tasksView.width('30%');
    this.projectsView.width('15%');
    this.taskDetailsView.width('55%');
  }

  public closeTaskDetails(){
    console.log("Main");
    this.tasksDetailsOpen = false;
    this.taskDetailsComponent.setTask(new Task()); //clearing fields
    
    this.setOriginalWidth();
  }

  private setOriginalWidth(){
    this.projectsView.width("30%");
    this.tasksView.width("70%");
  }

  loadTasks(project:Project){
    this.tasksComponent.setProject(project);
    // console.log(project);
  }

  afterSaveProject(project:Project){
    // TODO: alternatywą będzie ponowne wyszukanie wszystkim projektów
    // TODO: nie można tego robić w ten sposób, ponieważ przy aktualizacji dodaje do listy
    this.projectsComponent.addProject(project);
  }
  
  public openLabelsManager(){
    this.labelsOpen = true;
  }

  public closeLabelsManager(){
    this.labelsOpen = false;
  }

  public onLabelsUpdate(){
    this.taskDetailsComponent.loadLabels();
  }
}
