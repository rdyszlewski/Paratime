import { CdkDragDrop, CdkDragEnter, CdkDragExit, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Status } from 'app/database/data/models/status';
import { Task } from 'app/database/data/models/task';

@Component({
  selector: 'app-day-scheduler',
  templateUrl: './day-scheduler.component.html',
  styleUrls: ['./day-scheduler.component.css']
})
export class DaySchedulerComponent implements OnInit {

  private _hours: Hour[];
  public get hours():Hour[]{
    return this._hours;
  }
  private _selectedHour: Hour;

  private _connectedText: string;

  constructor() {

  }

  ngOnInit(): void {
    // TODO: zrobić takie coś, żeby było od innej godziny
    let firstHour = 5;
    this._hours = [];
    for(let i=firstHour; i< 24; i++){
      this._hours.push(new Hour(i, 0));
      this._hours.push(new Hour(i, 10, false));
      this._hours.push(new Hour(i, 20, false));
      this._hours.push(new Hour(i, 30, false));
      this._hours.push(new Hour(i, 40, false));
      this._hours.push(new Hour(i, 50, false, true));
      // this._hours.push(new Hour(i, 30, false, true));
    }
    for(let i= 0; i< firstHour; i++){
      this._hours.push(new Hour(i, 0));
      this._hours.push(new Hour(i, 10, false));
      this._hours.push(new Hour(i, 20, false));
      this._hours.push(new Hour(i, 30, false));
      this._hours.push(new Hour(i, 40, false));
      this._hours.push(new Hour(i, 50, false, true));
      // this._hours.push(new Hour(i, 30, false, true));
    }
    let hour = this._hours.find(x=>x.time == "9:00");
    // hour.task = new Task("Jeden", "", Status.STARTED);
    hour.addTask(new Task("Jeden", "", Status.STARTED));

    let hour2 = this._hours.find(x=>x.time=="12:00");
    hour2.addTask(new Task("Dwa", "", Status.STARTED));
    this._connectedText = this.hours.map(x=>x.time).join(',');
    console.log(this._connectedText);
  }

  public getTimesId():string{
    // let result = this._hours.map(x=>x.time);

    // console.log(result);
    // return result;
    return this._connectedText;
  }

  public position;

  // TODO: czy ta metoda na pewno wyglądała w ten sposób?
  public onDrop(event: CdkDragDrop<string[]>) {
    console.log(event);
    this.position = {x: 50, y:50};
    if (event.previousContainer === event.container) {
      // this.changeLabelsOrder(event.previousIndex, event.currentIndex);
      console.log(event);
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }


  public dragover(event: DragEvent, hour: Hour){
    console.log("Siema");
    if(hour != this._selectedHour){
      if(this._selectedHour){
        this._selectedHour.selected = false;
      }
    }
    hour.selected = true;
    console.log(hour);
    this._selectedHour = hour;
    event.preventDefault();
    event.stopPropagation();
  }

  // public drop(hour: Hour){
  //   console.log(hour);
  // }

  public drop(event: CdkDragDrop<Task[]>){
    console.log(event.item.data);
    // console.log(hour);
    // TODo: wykonać jakieś działania
    if(this._selectedHour){
      this._selectedHour.selected = false;
    }
  }

  public dragEntered(event: CdkDragEnter){
    console.log("DragEntered");
    this._selectedHour = event.item.data;
    this._selectedHour.selected = true;
  }

  public dragExited(event: CdkDragExit){
    console.log("DragExited");
    this._selectedHour.selected = false;
    this._selectedHour = null;
  }
}

export class Hour{
  private _hour: number;
  private _minutes: number;
  private _mainHour: boolean;
  private _selected: boolean;
  private _lastHour: boolean;

  // private _task: Task;
  private _tasks: Task[] = [];

  // TODO: tutaj można wstawić zadania
  public get time(){
    return this._hour + ":" + this.formatMinutes(this._minutes);
  }

  public get mainHour():boolean{
    return this._mainHour;
  }

  public get selected(): boolean{
    return this._selected;
  }

  public set selected(value: boolean){
    this._selected = value;
  }

  public get lastHour():boolean{
    return this._lastHour;
  }

  // public get task(): Task{
  //   return this._task;
  // }

  // public set task(value: Task){
  //   this._task = value;
  // }

  public getTask():Task[]{
    return this._tasks;
  }

  public setTasks(value: Task[]){
    // this._tasks = [];
    // this._tasks.push(value);
    this._tasks = value;
  }

  public addTask(value: Task){
    this._tasks.push(value);
  }

  constructor(hour: number, minutes: number, mainHour: boolean = true, lastHour=false){
    this._hour = hour;
    this._minutes = minutes;
    this._mainHour = mainHour;
    this._lastHour = lastHour;
  }

  private formatMinutes(minutes: number){
    return String(minutes).padStart(2, '0')
  }

}
