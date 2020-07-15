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
import { MatSnackBar } from '@angular/material/snack-bar';
import { StageDetailsComponent } from 'app/stage-details/stage-details.component';
import { Stage } from 'app/models/stage';
import { SpecialList } from 'app/projects/common/special_list';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  // TODO: usprawnić zarządzanie widokami

  @ViewChild(ProjectDetailsComponent) 
  private projectDetailsComponent: ProjectDetailsComponent;

  @ViewChild(TaskDetailsComponent) 
  private taskDetailsComponent: TaskDetailsComponent;
  
  @ViewChild(ProjectsComponent)
  private projectsComponent: ProjectsComponent;

  @ViewChild(TasksComponent)
  private tasksComponent: TasksComponent;

  @ViewChild(StageDetailsComponent)
  private stageDetailsComponent: StageDetailsComponent;

  public projectsOpen = true;
  public projectsDetailsOpen = false;
  public tasksOpen = true;
  public tasksDetailsOpen = false;
  public labelsOpen = false;
  public stageDetailsOpen = false;
  public pomodoroOpen = false;

  private projectsView;
  private projectDetailsView;
  private tasksView;
  private taskDetailsView;
  private stageDetailsView;

  public pomodoroTime:string;

  constructor(public snakBar: MatSnackBar) { }

  ngOnInit(): void {
    // this.configureDexie();
    this.projectsView = $("#projects");
    this.projectDetailsView = $("#projects-details");
    this.tasksView = $("#tasks");
    this.taskDetailsView = $('#task-details');
    this.stageDetailsView = $('#stage-details');

    this.setOriginalWidth();
    // this.deleteDatabase();
  }

  // metoda do testów TEST
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


    databaseTest.insertLabels();
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
  }

  public onCreateProject(project:Project){
    // TODO: alternatywą będzie ponowne wyszukanie wszystkim projektów
    // TODO: nie można tego robić w ten sposób, ponieważ przy aktualizacji dodaje do listy
    this.projectsComponent.addProject(project);
    this.projectsDetailsOpen = false;
    this.setOriginalWidth();
    this.projectsComponent.selectProject(project);
    
    this.openSnackBar("Pomyślnie utworzono nowy projekt");
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

  public onUpdateProject(project:Project){
    this.projectsComponent.updateProject(project);
  }

  public onCreateTask(task:Task){
    this.tasksDetailsOpen = false;
    this.setOriginalWidth();
    
    this.tasksComponent.addTask(task);
  }

  public onRemoveTask(taskId: number){
    if(this.tasksDetailsOpen){
      if(this.taskDetailsComponent.model.getTask().getId()==taskId){
        // TODO: może lepiej zrobić jakąś metodę close i open
        this.tasksDetailsOpen = false;
        this.setOriginalWidth();
      }
    }
  }

  public onRemoveSelectedProject(project:Project){
    this.projectsDetailsOpen = false;
    this.tasksDetailsOpen = false;
    this.setOriginalWidth();
    this.tasksComponent.setProject(null); //hide tasks panel
  }

  public openSnackBar(message:string){
    this.snakBar.open(message, null, {
      duration: 2000,
    });
  }

  public closeStageDetails(){
    this.stageDetailsOpen = false;
    this.projectsOpen = true;
    this.tasksOpen = true;
  }

  public onUpdateStage(stage: Stage){
    // TODO: coś tutaj dopisać
  }

  public onEditProjectStage(stage:Stage){
    // TODO: zrobić lepsze zarządzanie otwartymi oknami
    this.stageDetailsOpen = true;
    this.projectsOpen = false;
    this.tasksOpen = false;

    this.stageDetailsComponent.setStage(stage);
  }

  public togglePomodoroOpen(){
    this.pomodoroOpen = !this.pomodoroOpen;
  }

  public setPomodoroTime(time:string){
    this.pomodoroTime = time;
  }

  public onSpecialListCLick(listType: SpecialList){
    this.tasksComponent.setSpecialList(listType);
  }
}
