import { Component, OnInit } from '@angular/core';
import { Task } from 'app/models/task';
import { Status } from 'app/models/status';
import { Project } from 'app/models/project';
import { Tag } from 'app/models/tag';
import { Subtask } from 'app/models/subtask';
import { TaskDetails } from './model';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {

  public model: TaskDetails = new TaskDetails();

  // public task:Task = new Task();
  // public projects:Project[] = [];
  // public tags: Tag[] = [];
  // TODO: utworzyć model, zaznaczyć wybrany model

  constructor() { }

  ngOnInit(): void {
    let project1 = new Project("Projekt 1");
    project1.setId(1);
    let project2 = new Project("Projekt 2");
    project2.setId(2);
    let project3 = new Project("Projekt 3");
    project3.setId(3);
    this.model.getProjects().push(project1);
    this.model.getProjects().push(project2);
    this.model.getProjects().push(project3);


    let tag1 = new Tag("Pierwszy tag");
    tag1.setId(1);
    let tag2 = new Tag("Drugi tag");
    tag2.setId(2);
    
    this.model.getTags().push(tag1);
    this.model.getTags().push(tag2);

    this.model.getTask().addTag(tag1);

    let subtask1 = new Subtask("Podzadanie 1", "Jakiś opis", Status.ENDED);
    let subtask2 = new Subtask("Podzadanie 2", "Jakiś opis", Status.STARTED);
    this.model.getTask().addSubtask(subtask1);
    this.model.getTask().addSubtask(subtask2);
  }

  public getStatus(){
    return this.getStatusValue(this.model.getTask().getStatus());
  }

  // TODO: przenieść to do innej klasy, ponieważ ProjectDetailsComponent również z tego korzysta
  private getStatusValue(status:Status): string{
    switch(status){
      case Status.STARTED:
        return 'started';
      case Status.ENDED:
        return 'ended';
      case Status.CANCELED:
        return 'canceled';
      case Status.AWAITING:
        return 'awaiting';
      default:
        return 'awaiting';
    }
  }

  public addNewSubtask(){
    this.model.toggleSubtaskEditing();
    // TODO: ustawić focus na polu tekstowym
  }

}
