import { Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import { TaskDataSource } from './data-source/task.data.source';
import { MatSort } from '@angular/material/sort';
import { ProjectDataSource } from './data-source/project.data.source';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { DataService } from 'app/data.service';

@Component({
  selector: 'app-pomodoro-statistics',
  templateUrl: './pomodoro-statistics.component.html',
  styleUrls: ['./pomodoro-statistics.component.css']
})
export class PomodoroStatisticsComponent implements AfterViewInit, OnInit {

  public taskDataSource: TaskDataSource;
  public projectDataSource: ProjectDataSource;
  public displayedColumns = ["name", "time", "intervals"];

  @ViewChild('tasksSort') tasksSort: MatSort;
  @ViewChild('projectsSort') projectsSort: MatSort;
  @ViewChild('taskInput') taskFilter: ElementRef;
  @ViewChild('projectInput') projectFilter: ElementRef;


  constructor(private dataService:DataService) { }

  ngOnInit(): void {
    this.taskDataSource = new TaskDataSource(this.dataService);
    this.projectDataSource = new ProjectDataSource(this.dataService);
  }

  ngAfterViewInit(): void {
    this.tasksSort.sortChange.subscribe(()=>{
      this.loadTasksEntries()
    });

    this.projectsSort.sortChange.subscribe(()=>{
      this.loadProjectsEntries();
    });

    this.subscribeFilterEvents();

    this.loadTasksEntries();
    this.loadProjectsEntries();
  }

  private subscribeFilterEvents(){
    fromEvent(this.taskFilter.nativeElement,'keyup')
    .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
            this.loadTasksEntries();
        })
    )
    .subscribe();

    fromEvent(this.projectFilter.nativeElement,'keyup')
    .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
            this.loadProjectsEntries();
        })
    )
    .subscribe();
  }

  private loadTasksEntries(){
    this.taskDataSource.loadTasks(this.taskFilter.nativeElement.value, this.tasksSort.active, this.tasksSort.direction);
  }

  private loadProjectsEntries(){
    this.projectDataSource.loadProjects(this.projectFilter.nativeElement.value, this.projectsSort.active, this.projectsSort.direction);
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent){
    console.log(tabChangeEvent);
  }
}
