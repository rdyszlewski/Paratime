import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Status } from 'app/models/status';
import { Label } from 'app/models/label';
import { Subtask } from 'app/models/subtask';
import { TaskDetails } from './model';
import * as $ from 'jquery';
import { Task } from 'app/models/task';
import { DataService } from 'app/data.service';
import { FocusHelper } from 'app/common/view_helper';
import { KeyCode } from 'app/common/key_codes';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {
  
  private TASK_NAME_ID = '#task-name';
  private SUBTASK_NAME_ID = '#subtask';
  private SUBTASK_ITEM_ID = '#subtask-name-input_';

  public status = Status;
  public model: TaskDetails = new TaskDetails();

  @Output() closeEvent: EventEmitter<null> = new EventEmitter();
  @Output() saveEvent: EventEmitter<Task> = new EventEmitter();
  @Output() openLabelsEvent: EventEmitter<null> = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {
    this.init();
  }

  private init(){
    this.loadProjects();
    this.loadLabels();
  }

  private loadProjects() {
    DataService.getStoreManager().getProjectStore().getAllProjects().then(projects => {
      this.model.setProjects(projects);
    });
  }

  public loadLabels(){
    DataService.getStoreManager().getLabelStore().getAllLabel().then(labels=>{
      console.log(labels);
      this.model.setLabels(labels);
    });
  }  

  public setTask(task:Task){
    if(task){
      this.model.setTask(task);
      FocusHelper.focus(this.TASK_NAME_ID);
    }
  }

  // LABELS 

  public chooseLabel(label:Label){
    DataService.getStoreManager().getLabelStore().connectTaskAndLabel(this.model.getTask().getId(), label.getId()).then(()=>{
      this.model.getTask().addLabel(label);
    });
  }

  public removeLabel(label:Label){
    DataService.getStoreManager().getLabelStore().removeLabelFromTask(this.model.getTask().getId(), label.getId()).then(()=>{
      this.model.getTask().removeLabel(label);
      this.model.setEditedSubtask(null);
    });
  }

  // SUBTASKS
  
  public openAddingSubtask(){
    this.model.setSubtaskEditing(true);
    this.model.setEditedSubtask(null);
    FocusHelper.focus(this.SUBTASK_NAME_ID);
  }

  public closeAddingSubtask(){
    $(this.SUBTASK_NAME_ID).val("");
    this.model.setSubtaskEditing(false);
  }
  
  public addNewSubtask(){
    const subtaskName = $(this.SUBTASK_NAME_ID).val();    
    const subtask = new Subtask(subtaskName,null, Status.STARTED);
    this.saveNewSubtask(subtask);
    this.closeAddingSubtask();
  }

  private saveNewSubtask(subtask: Subtask) {
    DataService.getStoreManager().getSubtaskStore().createSubtask(subtask).then(insertedSubtask => {
      this.model.getTask().addSubtask(insertedSubtask);
    });
  }

  public openEditingSubtask(subtask:Subtask){
    this.model.setEditedSubtask(subtask);
    this.model.setSubtaskEditing(false);
    FocusHelper.focus(this.getSubtaskItemId(subtask));
  }

  public closeEditingSubtask(){
    this.model.setEditedSubtask(null);
  }

  private getSubtaskItemId(subtask: Subtask):string{
    return this.SUBTASK_ITEM_ID + subtask.getId();
  }

  public acceptEditingSubtask(subtask:Subtask){
    const subtaskNameField = $(this.getSubtaskItemId(subtask));
    subtask.setName(subtaskNameField.val());
    this.updateSubtask(subtask);
  }

  private updateSubtask(subtask: Subtask) {
    DataService.getStoreManager().getSubtaskStore().updateSubtask(subtask).then(updatedSubtask => {
      this.closeEditingSubtask();
    });
  }

  public removeSubtask(subtask:Subtask){
    DataService.getStoreManager().getSubtaskStore().removeSubtask(subtask.getId()).then(()=>{
      this.model.getTask().removeSubtask(subtask);
    });
  }

  public toggleSubtaskStatus(subtask:Subtask){
    switch(subtask.getStatus()){
      case Status.STARTED:
        subtask.setStatus(Status.ENDED);
        break;
      case Status.ENDED:
        subtask.setStatus(Status.STARTED);
        break;
    }
  }  

  public updateTask(){
    DataService.getStoreManager().getTaskStore().updateTask(this.model.getTask()).then(()=>{});
  }

  public closeView(){
    this.closeEvent.emit();
  }

  public openLabelsManager(){
    this.openLabelsEvent.emit();
  }

  public handleKeysOnNewSubtaskInput(event:KeyboardEvent){
    if(event.keyCode == KeyCode.ENTER){
      this.addNewSubtask();
    } 
    if(event.keyCode == KeyCode.ESC){
      this.closeAddingSubtask();
    }
  }

  public handleKeysOnEditSubtask(event:KeyboardEvent, subtask:Subtask){
    if(event.keyCode == KeyCode.ENTER){
      this.acceptEditingSubtask(subtask);
    } 
    if(event.keyCode == KeyCode.ESC){
      this.closeEditingSubtask();
    }
  }

  // return amount of subtask with status ENDED
  public getFinishedSubtasks(task:Task){
    let finishedSubtask = task.getSubtasks().filter(x=>x.getStatus()==Status.ENDED);
    return finishedSubtask.length;
  }
}
