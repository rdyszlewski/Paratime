import { Injectable } from '@angular/core';
import { Task } from 'app/database/data/models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor() { }

  private removeTask(task:Task){
    // TODO: usunięcie
  }
}
