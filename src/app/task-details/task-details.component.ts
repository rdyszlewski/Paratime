import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Status } from 'app/models/status';
import { TaskDetails } from './model/model';
import { Task } from 'app/models/task';
import { DataService } from 'app/data.service';
import { FocusHelper } from 'app/common/view_helper';
import { Priority } from 'app/models/priority';
import { TaskViewState } from './model/state';
import { TaskValidator } from './model/validator';
import { TaskChangeDetector } from './model/change.detector';
import { SubtasksController } from './subtasks/subtasks.editing.controller';
import { TaskLabelsController } from './labels/task.labels.controller';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Subtask } from 'app/models/subtask';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css'],
})
export class TaskDetailsComponent implements OnInit {
  
  private TASK_NAME_ID = '#task-name';

  @Output() closeEvent: EventEmitter<null> = new EventEmitter();
  @Output() saveEvent: EventEmitter<Task> = new EventEmitter();
  @Output() openLabelsEvent: EventEmitter<null> = new EventEmitter();

  public status = Status;
  public priority = Priority;

  private model: TaskDetails;
  private state: TaskViewState;
  private validator: TaskValidator;
  private changeDetector: TaskChangeDetector;
  private subtaskController: SubtasksController;
  private labelsController: TaskLabelsController;

  
  constructor() { }

  ngOnInit(): void {
    this.model = new TaskDetails();
    this.state = new TaskViewState(this.model);
    this.validator = new TaskValidator(this.model);
    this.changeDetector = new TaskChangeDetector(this.model);
    this.subtaskController = new SubtasksController();
    this.labelsController = new TaskLabelsController(this.model);
    this.init();
  }

  public getModel():TaskDetails{
    return this.model;
  }

  public getState():TaskViewState{
    return this.state;
  }

  public getValidator():TaskValidator{
    return this.validator;
  }

  public getChangeDetector():TaskChangeDetector{
    return this.changeDetector;
  }

  public getSubtask():SubtasksController{
    return this.subtaskController;
  }

  public getLabels():TaskLabelsController{
    return this.labelsController;
  }

  private init(){
    this.loadProjects();
    this.loadStages();
  }

  // TODO: zorientować się, czy to jest potrzebne
  private loadProjects() {
    DataService.getStoreManager().getProjectStore().getAllProjects().then(projects => {
      this.model.setProjects(projects);
    });
  }

  public loadStages(){
    if(this.model.getTask().getProjectID()){
      DataService.getStoreManager().getStageStore().getStagesByProject(this.model.getTask().getProjectID()).then(stages=>{
        this.model.setStages(stages);
      });
    }
  }

  public setTask(task:Task){
    if(task){
      this.model.setTask(task);
      this.init();
      this.subtaskController.setTask(task);
      FocusHelper.focus(this.TASK_NAME_ID);
    }
  }

  public updateTask(){
    if(this.validator.isValid()){
      DataService.getStoreManager().getTaskStore().updateTask(this.model.getTask()).then(()=>{});
    }
  }

  public closeView(){
    this.closeEvent.emit();
  }

  public openLabelsManager(){
    this.openLabelsEvent.emit();
  }

  // return amount of subtask with status ENDED
  public getFinishedSubtasks(task:Task){
    let finishedSubtask = task.getSubtasks().filter(x=>x.getStatus()==Status.ENDED);
    return finishedSubtask.length;
  }

  public toggleTaskImportance(){
    this.model.toggleTaskImportance();
    this.updateTask();
  }

  public onDrop(event: CdkDragDrop<any[]>){
    if(event.previousContainer === event.container){
      this.replaceSubtaskOrder(event.previousIndex, event.currentIndex);
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  // TODO: przenieść to w jakieś inne miejsce. Połączyć ze zmianą kolejności w zadaniach
  private replaceSubtaskOrder(previousIndex: number, currentIndex: number){
    // TODO: spróbować połączyć to z sortowaniem zadań
    const subtask1 = this.model.getSubtaskByIndex(previousIndex);
    const subtask2 = this.model.getSubtaskByIndex(currentIndex);
    const nextSubtask1 = this.model.getSubtaskByOrderPrev(subtask1);
    const nextSubtask2 = this.model.getSubtaskByOrderPrev(subtask2);
    console.log(nextSubtask1);
    console.log(nextSubtask2);
    if(nextSubtask1){
      nextSubtask1.setPreviousSubtask(subtask2.getId());
      this.updateSubtask(nextSubtask1);
    }
    if(nextSubtask2){
      nextSubtask2.setPreviousSubtask(subtask1.getId());
      this.updateSubtask(nextSubtask2);
    }
    const temp = subtask1.getPreviousSubtask();
    subtask1.setPreviousSubtask(subtask2.getPreviousSubtask());
    subtask2.setPreviousSubtask(temp);

    this.updateSubtask(subtask1);
    this.updateSubtask(subtask2);
  }

  private updateSubtask(subtask:Subtask){
    DataService.getStoreManager().getSubtaskStore().updateSubtask(subtask).then(updatedSubtask=>{

    });
  }

  // TODO: przerzucić to gdzieś
  public timeChange(time: string){
    console.log("Siemano");
    console.log(time);
    const values = time.split(":");
    const hours = values[0];
    const minutes = values[1];
    console.log(hours);
    console.log(minutes);
  }

  public getTime():string{
    const value = 100
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    return hours.toString() + ":" + minutes.toString();
  }
}