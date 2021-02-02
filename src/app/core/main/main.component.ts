import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Task } from 'app/database/shared/task/task';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Stage } from 'app/database/shared/stage/stage';
import { ProjectDetailsComponent } from 'app/tasks/details-container/project-details/project-details.component';
import { DetailsContainerComponent } from 'app/tasks/details-container/details-container.component';
import { ProjectsComponent } from 'app/tasks/lists-container/projects/projects.component';
import { TasksContainerComponent } from 'app/tasks/tasks-container/tasks-container.component';
import { SpecialList } from 'app/tasks/lists-container/projects/common/special_list';
import { TasksMode, AppService } from '../services/app/app.service';
import { LocalDatabase } from 'app/database/local/database';
import { TimeService } from '../services/time/time.service';
import { PomodoroComponent } from 'app/shared/side-container/pomodoro/pomodoro.component';
import { PomodoroSettingsStore } from 'app/pomodoro/pomodoro/settings/settings.storage';
import { DataService } from 'app/data.service';
import { LocalDataSource } from 'app/database/local/local.source';
import { Project } from 'app/database/shared/project/project';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, AfterViewInit {
  public taskMode = TasksMode;

  // TODO: usprawnić zarządzanie widokami

  @ViewChild(ProjectDetailsComponent)
  private projectDetailsComponent: ProjectDetailsComponent;

  @ViewChild(ProjectsComponent)
  private projectsComponent: ProjectsComponent;


  @ViewChild(PomodoroComponent)
  private pomodoroComponent: PomodoroComponent;

  @ViewChild(TasksContainerComponent)
  private tasksContainer: TasksContainerComponent;

  @ViewChild(DetailsContainerComponent)
  public detailsContainer: DetailsContainerComponent;

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
  @ViewChild('workDetailsSpace') workDetailsSpace: ElementRef;
  @ViewChild('sidebarSpace') sidebarSpace: ElementRef;

  public pomodoroTime: string;

  constructor(private appService: AppService, public snakBar: MatSnackBar,
    private timeService: TimeService, private dataService: DataService) {}

  ngAfterViewInit(): void {
    console.log("Inicjalizacja tyknięcia");
    this.setOriginalWidth();

  }

  ngOnInit(): void {
    this.dataService.setSource(new LocalDataSource());
    // PomodoroSettingsStore.removeSettings();
    // this.deleteDatabase();
    // this.configureDexie();
  }

  private deleteDatabase() {
    var database = new LocalDatabase();
    database.delete().then(() => {
      console.log('Usunięto bazę danych');
    });
  }

  public openProjectDetails(project) {
    this.projectDetailsComponent.setProject(project);
    this.projectsDetailsOpen = true;
    this.tasksDetailsOpen = false;

    this.setWidthOnProjectViewOpen();
  }

  // TODO: wymyślić jakiś sprytniejszy plan wstawiania szerokości
  // TODO: może nazwać jakoś poszczególne stany, i przygotować odgórnie ustawienia
  private setWidthOnProjectViewOpen() {
    this.setWidth(this.listSpace, 20);
    this.setWidth(this.listDetailsSpace, 60);
  }

  private setWidth(element: ElementRef, width) {
    // element.nativeElement.style.minWidth = width + '%';
  }

  closeProjectDetails() {
    this.projectsDetailsOpen = false;
    this.setOriginalWidth();
  }

  // TODO: przenieść gdzieś
  public openTaskDetails(task: Task) {
    // this.taskDetailsComponent.setTask(task);
    this.tasksDetailsOpen = true;
    this.projectsDetailsOpen = false;

    this.setWidthOnTaskViewOpen();
  }

  private setWidthOnTaskViewOpen() {
    this.setWidth(this.listSpace, 15);
    this.setWidth(this.workDetailsSpace, 55);
  }

  // TODO: przenieść gdzieś
  public closeTaskDetails() {
    this.tasksDetailsOpen = false;
    // this.taskDetailsComponent.setTask(new Task()); //clearing fields

    this.setOriginalWidth();
  }

  private setOriginalWidth() {
    this.setWidth(this.listSpace, 30);
  }

  public onCreateProject(project: Project) {
    // TODO: alternatywą będzie ponowne wyszukanie wszystkim projektów
    // TODO: nie można tego robić w ten sposób, ponieważ przy aktualizacji dodaje do listy
    this.projectsComponent.addProject(project);
    this.projectsDetailsOpen = false;
    this.setOriginalWidth();
    this.projectsComponent.selectProject(project);

    this.openSnackBar('Pomyślnie utworzono nowy projekt');
  }

  public openLabelsManager() {
    this.labelsOpen = true;
  }

  public closeLabelsManager() {
    this.labelsOpen = false;
  }

  // TODO: zrobić coś z tym
  public onLabelsUpdate() {
    // this.taskDetailsComponent.getLabels().loadLabels();
  }

  public onUpdateProject(project: Project) {
    this.projectsComponent.updateProject(project);
  }

  public onCreateTask(task: Task) {
    this.tasksDetailsOpen = false;
    this.setOriginalWidth();

    // TODO: dorobić metodę dodawania metody

    // this.tasksComponent.addTask(task);
  }

  // TODO: odtworzyć ten warunek
  public onRemoveTask(taskId: number) {
    if (this.tasksDetailsOpen) {
      // if (this.taskDetailsComponent.getModel().getTask().getId() == taskId) {
        // TODO: może lepiej zrobić jakąś metodę close i open
        this.tasksDetailsOpen = false;
        this.setOriginalWidth();
      // }
    }
  }

  public onRemoveSelectedProject(project: Project) {
    this.projectsDetailsOpen = false;
    this.tasksDetailsOpen = false;
    this.setOriginalWidth();
    // TODO: sprawdzić, czy to będzie odpowiednie
    this.tasksContainer.openProject(null);
  }

  public openSnackBar(message: string) {
    this.snakBar.open(message, null, {
      duration: 2000,
    });
  }

  public closeStageDetails() {
    this.stageDetailsOpen = false;
    this.projectsOpen = true;
    this.tasksOpen = true;
  }

  public onUpdateStage(stage: Stage) {
    // TODO: coś tutaj dopisać
  }

  public onEditProjectStage(stage: Stage) {
    // TODO: zrobić lepsze zarządzanie otwartymi oknami
    this.stageDetailsOpen = true;
    this.projectsOpen = false;
    this.tasksOpen = false;

    // TODO: ustawić to jakoś
    // this.stageDetailsComponent.setStage(stage);
  }

  public togglePomodoroOpen() {
    this.pomodoroOpen = !this.pomodoroOpen;
  }

  public setPomodoroTime(time: string) {
    this.pomodoroTime = time;
  }

  public onSpecialListCLick(listType: SpecialList) {
    // TODO: zrobić wyświetlanie list specjalnych
    // this.tasksComponent.getSpecialList().setSpecialList(listType);
  }

  public addTaskToPomodoro(task: Task): void {
    console.log("Dodawanie zadania do pomodoro");
    this.pomodoroComponent.addTaskToPomodoro(task);
  }

  public closeKanban() {
    this.kanbanOpen = false;
    this.tasksOpen = true;
  }

  public openProject(project: Project) {
    this.tasksContainer.openProject(project);
  }

  public isDetailsOpen(){
    if(this.detailsContainer){
      return this.detailsContainer.isOpen();
    }
    return false;
  }

  private tickPomodoro(time:string){
    console.log("Tyknięcie " + time);
    this.pomodoroTime = time;
  }

  public getPomodoroTime(){
    if(this.timeService.getTime()){
      return this.timeService.getTime();
    }
  }
}
