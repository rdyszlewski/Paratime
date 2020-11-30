import { CdkDrag, CdkDragDrop, CdkDragEnter, CdkDragExit, CdkDragMove, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {  AfterViewInit, Component, OnInit, NgZone, HostListener } from '@angular/core';
import { Status } from 'app/database/data/models/status';
import { Task } from 'app/database/data/models/task';
import { Hour } from './day-model';
import { TaskContainer } from './task-container';

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

  private _resizedTask: TaskContainer;
  private _currentScale = 100;
  private _baseCellHeight = 6;

  constructor(private ngZone: NgZone) {

  }

  @HostListener('window:resize', ['$event'])
    onResize(event) {
      console.log("Resize");
      setTimeout(()=>{
        this.changeSchedulerScale(this._currentScale);
      });

  }

  ngAfterViewInit(): void {
    this.changeSchedulerScale(this._currentScale);
  }

  private setCellsHeight(scale: number){
    let baseHeight = this.calculateBaseCellHeight();
    let height = baseHeight * (scale/100);
    this._hours.forEach(x=>x.height = height);
    this._baseCellHeight = height;
    this._currentScale = scale;
  }

  private calculateBaseCellHeight(){
    let element = document.getElementById("5:00") as HTMLElement;
    let parentElement = element.parentElement;
    let parentHeight = parentElement.offsetHeight;
    let cellHeight = Math.floor(parentHeight/this._hours.length);
    return cellHeight;
  }

  private calculateHeightOfTasks(){
    this._hours.forEach(x=>x.tasks.forEach(task=>{
      let cells = Math.ceil(task.task.getPlannedTime()/10);
      let cellElement = document.getElementById("5:00") as HTMLElement;
      let cellHeight = cellElement.offsetHeight;
      let taskHeight = cells * cellHeight;
      task.size = taskHeight;
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
      this.calculateHeightOfTasks();

    });
  }

  ngOnInit(): void {
    // TODO: zrobić takie coś, żeby było od innej godziny

    // TODO: refaktoryzacja
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
    task1.setTime(900);
    task1.setPlannedTime(150);
    let taskContainer1 = new TaskContainer(task1)
    // taskContainer1.size = 7*6;
    hour.addTask(taskContainer1);

    let hour2 = this._hours.find(x=>x.time=="15:00");
    let task2 = new Task("Dwa", "", Status.STARTED);
    task2.setId(2);
    task2.setTime(1500);
    task2.setPlannedTime(50);
    let taskContainer2 = new TaskContainer(task2);
    // taskContainer2.size = 7*15;
    hour2.addTask(taskContainer2);

  }


  // TODO: czy ta metoda na pewno wyglądała w ten sposób?
  public onDrop(event: CdkDragDrop<string[]>) {
    let id = event.item.element.nativeElement.id;
    if(id.includes("bottom") || id.includes('top')){
      console.log(this._resizedTask);
      // TODO: można wymyślić coś przyjemniejszego
      let plannedTime = this._resizedTask.size / this._baseCellHeight * 10;
      console.log("Planned time");
      console.log(plannedTime);
      console.log(this._baseCellHeight);
      this._resizedTask.task.setPlannedTime(plannedTime);
      this._resizedTask.offset = 0;
      this._resizedTask.show();
      // TODO: zrobić zapisywanie w bazie danych
    }

    if(id.includes('bottom')){
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
    // TODO: zaktualizowanie czasu
    let timeId = event.container.element.nativeElement.id;
    let splitted = timeId.split(":");
    let timeValue = Number.parseInt(splitted[0]) * 100 + Number.parseInt(splitted[1]);
    this._resizedTask.task.setTime(timeValue);
    // TODO: zrobić zapisywanie w bazie danych
  }

  public canDrop(item: CdkDrag){
    console.log(item);
  }

  public dragMove(event: CdkDragMove<any>, taskContainer: TaskContainer){
    this._resizedTask = taskContainer;
    let taskElement = document.getElementById("task_"+taskContainer.task.getId());
    let element = event.source.element.nativeElement;

    if(element.id.includes('top')){
      console.log("Góra");
      this.moveTask(element, taskElement, event, taskContainer);
      this.resize(element, taskElement, event.distance, taskContainer, true);
    } else {
      console.log("Dół");
      this.resize(element, taskElement, event.distance, taskContainer, false)
    }
  }

  private _baseTaskHeight = null;

  private moveTask(dragHandle: HTMLElement, target: HTMLElement, event:CdkDragMove<any>, taskContainer: TaskContainer){
    taskContainer.hide();
    // let distanceY = Math.ceil(distance["y"]-distance["y"]%this._baseCellHeight);
    let distance = event.distance;
    let distanceY = distance["y"];
    let rest = distanceY % this._baseCellHeight;
    distanceY -= rest;
    distanceY -= this._baseCellHeight;

    // if(rest != 0){
    //   distanceY -= rest;
    //   // TODO: to zależy od tego, czy ruch jest w górę  czy w dół
    //   // distanceY -= this._baseCellHeight;
    // }
    taskContainer.offset = distanceY;
  }

  private resize(dragHandle: HTMLElement, target: HTMLElement, distance, taskContainer: TaskContainer, top: boolean){
    taskContainer.hide();
    // let distanceY = Math.ceil(distance["y"]-distance["y"]%this._baseCellHeight);
    let distanceY = distance["y"];
    let rest = distanceY%this._baseCellHeight;
    if(rest != 0){
      distanceY -= rest;
      if(top){
        distanceY -= this._baseCellHeight;
      } else {
        distanceY += this._baseCellHeight;
      }
    }
    let orginalHeight = taskContainer.task.getPlannedTime()/10 * this._baseCellHeight;
    if(top){
      taskContainer.size = orginalHeight - distanceY;
    } else {
      taskContainer.size = orginalHeight + distanceY;
    }
  }

  public dragEntered(event:CdkDragEnter){
    let id = event.container.element.nativeElement.id;
    let selectedHourIndex = this._hours.findIndex(x=>x.time==id);
    selectedHourIndex++;
    if(selectedHourIndex == this.hours.length){
      selectedHourIndex = 0;
    }
    this.selectedHour = this._hours[selectedHourIndex];
  }

  public dragExited(event:CdkDragExit){
    this.selectedHour = null;
  }

  // =-========================

  public drag(event: DragEvent){
    if(this.selectedHour){
      console.log(this.selectedHour.time);
    }
  }

  public canDrag = true;
  public resizeActive = false;
  private selectedHour: Hour;

  public resizeMouseEnter(){
    this.canDrag = false;
  }

  public resizeMouseExit(){
    this.canDrag = true;
  }

  public resizeStart(event){
    this.resizeActive = true;
  }

  public resizeEnd(event){
    this.resizeActive = false;
  }

  public isMoveTaskDisabled(){
    return !this.canDrag && this.resizeActive;
  }

  public dragover(event: DragEvent, hour: Hour){
    this.selectedHour = hour;
  }

}



