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
    // this.configureDexie();
  }



  public getTasks(){
    // return this.tasks;
    return [];
  }

}
