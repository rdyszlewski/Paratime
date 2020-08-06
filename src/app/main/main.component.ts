import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
import { PomodoroComponent } from 'app/pomodoro/pomodoro.component';
import { KanbanComponent } from 'app/kanban/kanban.component';
import { AppService } from 'app/services/app/app.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit {

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

  @ViewChild(PomodoroComponent)
  private pomodoroComponent: PomodoroComponent;

  @ViewChild(KanbanComponent)
  private kanbanComponent: KanbanComponent;

  public projectsOpen = true;
  public projectsDetailsOpen = false;
  public tasksOpen = true;
  public tasksDetailsOpen = false;
  public labelsOpen = false;
  public stageDetailsOpen = false;
  public pomodoroOpen = false;
  public kanbanOpen = false;

  @ViewChild('listSpace') listSpace: ElementRef;
  @ViewChild('listDetailsSpace') listDetailsSpace: ElementRef;
  @ViewChild('workSpace') workSpace: ElementRef;
  @ViewChild('workDetailsSpace') workDetailsSpace: ElementRef;
  @ViewChild('sidebarSpace') sidebarSpace: ElementRef;

  public pomodoroTime:string;

  private currentProject: Project;

  constructor(private appService: AppService,public snakBar: MatSnackBar) { }

  ngAfterViewInit(): void {
    this.setOriginalWidth();
  }

  ngOnInit(): void {
    // this.deleteDatabase();
    // this.configureDexie();

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
    this.setWidth(this.workSpace, 20);
    this.setWidth(this.listSpace, 20);
    this.setWidth(this.listDetailsSpace, 60);
  }

  private setWidth(element: ElementRef, width){
    element.nativeElement.style.minWidth = width + "%";
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
    this.setWidth(this.workSpace, 30);
    this.setWidth(this.listSpace, 15);
    this.setWidth(this.workDetailsSpace, 55);
  }

  public closeTaskDetails(){
    this.tasksDetailsOpen = false;
    this.taskDetailsComponent.setTask(new Task()); //clearing fields

    this.setOriginalWidth();
  }

  private setOriginalWidth(){
    this.setWidth(this.listSpace, 30);
    this.setWidth(this.workSpace, 70);
  }

  // TODO: przydałoby się zmienić nazwę
  loadTasks(project:Project){
    this.currentProject = project;
    this.tasksComponent.setProject(project);
    // this.appService.setCurrentProject(project); // TODO: to można przywrócić. Będzie lepsze zarządzanie zadaniami


    // TODO: możliwe, że tutja przydałoby się jakieś ustawianie rozmiaru
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
    this.taskDetailsComponent.getLabels().loadLabels();
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
      if(this.taskDetailsComponent.getModel().getTask().getId()==taskId){
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
    this.tasksComponent.getSpecialList().setSpecialList(listType);
  }

  public addTaskToPomodoro(task:Task):void{
    this.pomodoroComponent.addTaskToPomodoro(task);
  }

  public openKanban(project:Project){
    // this.appService.setCurrentProject(project);
    this.currentProject = project;
    this.tasksOpen = false;
    this.kanbanOpen = true;
    this.kanbanComponent.openProject(project);
  }

  public closeKanban(){
    this.kanbanOpen = false;
    this.tasksOpen = true;
  }

  public openTaskListMode(){
    this.loadTasks(this.currentProject);
    this.kanbanOpen = false;
    this.tasksOpen = true;
  }

  public openKanbanMode(){
    // this.openKanban(this.appService.getCurrentProject());
    this.openKanban(this.currentProject);
    this.kanbanOpen = true;
    this.tasksOpen = false;
  }
}
