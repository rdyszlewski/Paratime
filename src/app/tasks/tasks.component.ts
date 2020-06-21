import { Component, OnInit } from '@angular/core';
import { Project } from 'app/models/project';
import { Subtask } from 'app/models/subtask';
import { Status } from 'app/models/status';
import { ProjectType } from 'app/models/project_type';
import Dexie, { DBCoreRangeType } from 'dexie';
import { Task } from 'app/models/task';
import { LocalDatabase } from 'app/data/local/database';


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
    // this.addMockProject();
    this.configureDexie();
  }

  private configureDexie(){
    this.deleteDatabase(); // TODO: po testowaniu sunąć to 
    var database = new LocalDatabase();
    let task = new Task();
    task.setName("Zadanie 2");
    task.setDescription("To jest zadanie 2");
    task.setStatus(Status.STARTED);
    // database.tasks.put(task);
    // TODO: sprawdzić to
    this.loadData(database);
  }

  private async loadData(database){
      let tasks = await database.tasks.where('id').above(-1).toArray();
      let task = tasks[2] as Task;
      console.log(task);
      // return Promise.all(database.tasks.where('id').equals(1).toArray(tasks=>this.tasks = tasks)).then(x=>this);
  }

  private deleteDatabase(){
    var database = new LocalDatabase();
    database.delete().then(()=>{
      console.log("Usunięto bazę danych");
    })
  }

 

  // private addMockProject(){
  //   let project = new Project();
  //   project.setId(1);
  //   project.setName("Projekt 1");
  //   project.setDescription("To jest zwykły projekt");
  //   project.setStartDate(new Date(2020, 4, 1));
  //   project.setType(ProjectType.SMALL);

  //   let task1 = new Task();
  //   task1.setId(1);
  //   task1.setName("Zadanie 1");
  //   task1.setDescription("Opis do zadania 1");
  //   task1.setProject(project);
  //   task1.setStatus(Status.CANCELED);

  //   let subtask = new Subtask();
  //   subtask.setId(1);
  //   subtask.setName("Podzadanie");
  //   subtask.setDescription("To jest podzadanie do pierwszego zadania");
  //   subtask.setStatus(Status.STARTED);

  //   task1.addSubtask(subtask);
  //   project.addTask(task1);

  //   console.log(JSON.stringify(project, ProjectReplacer.replacer));
  // }


  public getTasks(){
    // return this.tasks;
    return [];
  }

}
