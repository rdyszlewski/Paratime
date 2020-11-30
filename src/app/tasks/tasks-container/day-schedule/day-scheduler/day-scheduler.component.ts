import { CdkDrag, CdkDragDrop, CdkDragEnter, CdkDragExit, CdkDragMove, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {  AfterViewInit, Component, OnInit, NgZone } from '@angular/core';
import { Status } from 'app/database/data/models/status';
import { Task } from 'app/database/data/models/task';

@Component({
  selector: 'app-day-scheduler',
  templateUrl: './day-scheduler.component.html',
  styleUrls: ['./day-scheduler.component.css']
})
export class DaySchedulerComponent implements OnInit, AfterViewInit {
  [x: string]: any;

  private _hours: Hour[];
  public get hours():Hour[]{
    return this._hours;
  }

  private _sizeRatio:number;

  constructor(private ngZone: NgZone) {

  }

  ngAfterViewInit(): void {
    this.changeSchedulerScale(100);
  }

  private setCellsHeight(scale: number){
    let parts = this._hours.length;
    let height = scale / parts;
    this._hours.forEach(x=>x.height = height);
  }

  private calculateBaseCellHeight(){
    let element = document.getElementById("5:00") as HTMLElement;
    let offsetHeight = element.offsetHeight;
    let clientHeight = element.clientHeight;
    console.log(offsetHeight);
    console.log(clientHeight);
    let result = offsetHeight/clientHeight;
    console.log(result);
    return result;
  }

  private calculateHeightOfTasks(){
    this._hours.forEach(x=>x.tasks.forEach(task=>{
      task.size = this._sizeRatio * (task.task.getTime()/10) * 100;
    }));
  }

  public changeScale(event){
    let scale = event.target.value;
    this.changeSchedulerScale(scale);
  }

  private changeSchedulerScale(scale: number){
    setTimeout(()=>{
      this.setCellsHeight(scale);
    },0);
    setTimeout(()=>{
      this._sizeRatio = this.calculateBaseCellHeight();
      this.calculateHeightOfTasks();
    });
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
    let task1 = new Task("Jeden", "", Status.STARTED);
    task1.setId(1);
    task1.setTime(120);
    let taskContainer1 = new TaskContainer(task1)
    // taskContainer1.size = 7*6;
    hour.addTask(taskContainer1);

    let hour2 = this._hours.find(x=>x.time=="15:00");
    let task2 = new Task("Dwa", "", Status.STARTED);
    task2.setId(2);
    task2.setTime(50);
    let taskContainer2 = new TaskContainer(task2);
    // taskContainer2.size = 7*15;
    hour2.addTask(taskContainer2);

  }

  // TODO: czy ta metoda na pewno wyglądała w ten sposób?
  public onDrop(event: CdkDragDrop<string[]>) {
    let id = event.item.element.nativeElement.id;
    if(!id.includes("task")){
      // TODO: tutaj być może powinno być zapisywanie wysokości
      return;
    }
    if (event.previousContainer === event.container) {
      // this.changeLabelsOrder(event.previousIndex, event.currentIndex);

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

  public canDrop(item: CdkDrag){
    console.log(item);
  }

  public dragMove(event: CdkDragMove<any>, taskContainer: TaskContainer){
    // TODO: to z jakiegoś powodu nie działa
    // let taskElement = event.source.element.nativeElement.offsetParent;q
    let taskElement = document.getElementById("task_"+taskContainer.task.getId());
    let element = event.source.element.nativeElement;

    // this.resize(element, taskElement);
    this.ngZone.runOutsideAngular(()=>{
      this.resize(element, taskElement, event.distance, taskContainer)
    })
  }

  private resize(dragHandle: HTMLElement, target: HTMLElement, distance, taskContainer: TaskContainer){
    const dragRect = dragHandle.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    // console.log(targetRect);

    // TODO: naprawić to
    const height = dragRect.top - targetRect.top + dragRect.height;
    let dinstanceY = distance["y"];
    let cellHeight = document.getElementById("5:00").offsetHeight;
    let cells = dinstanceY / cellHeight;
    let minutes = cells * 10;
    console.log("minutes");
    console.log(minutes);
    // TODO: będzie trzeba zaktualizować czas w zadaniu. Albo wymyślić jakiś inny sposób
    let taskHeight = taskContainer.size +  this._sizeRatio * (minutes/10) * 100;
    taskContainer.size = taskHeight;
    console.log(taskHeight);

    // target.style.height = target.style.height + distance + "% !important";

    setTimeout(()=>{
      // console.log("Update");
    });
    // TODO: może dałoby się zamienić to jakoś na procenty
    // this.setAllHandleTransform();
  }



}

export class TaskContainer{
  private _task: Task;
  private _size: number;

  public get task(): Task{
    return this._task;
  }

  public get size(): number{
    return this._size;
  }

  public set size(value: number){
    this._size = value;
  }

  // public getHeight():string{
  //   return this.size + "%";
  // }

  constructor(task: Task){
    this._task = task;
  }
}

export class Hour{
  private _hour: number;
  private _minutes: number;
  private _mainHour: boolean;
  private _selected: boolean;
  private _lastHour: boolean;
  private _height: number;

  // private _task: Task;
  private _tasks: TaskContainer[] = [];

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

  public get height():number{
    return this._height;
  }

  public set height(value: number){
    this._height = value;
  }

  // public get task(): Task{
  //   return this._task;
  // }

  // public set task(value: Task){
  //   this._task = value;
  // }

  public get tasks(): TaskContainer[]{
    return this._tasks;
  }

  public addTask(value: TaskContainer){
    this._tasks.push(value);
  }

  public removeTask(value: TaskContainer){
    this._tasks = this._tasks.filter(x=>x!=value);
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
