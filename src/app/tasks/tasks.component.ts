import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { Task } from 'app/models/task';
import { Project } from 'app/models/project';
import { Status } from 'app/models/status';
import { TasksModel } from './model';
import { DataService } from 'app/data.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogHelper } from 'app/common/dialog';
import { FocusHelper } from 'app/common/view_helper';
import * as $ from 'jquery';
import { KeyCode } from 'app/common/key_codes';
import { Priority } from 'app/models/priority';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  private TASK_NAME_INPUT = "#new-task-name";
  private TASK_LIST = "#tasks-list";
  
  @Output() detailsEvent: EventEmitter<Task> = new EventEmitter();
  @Output() removeEvent: EventEmitter<number> = new EventEmitter();
  
  public model: TasksModel = new TasksModel();
  public status = Status;

  constructor(public dialog:MatDialog) { }
  
  ngOnInit(): void {
    this.loadLabels();
  }

  private loadLabels(){
    DataService.getStoreManager().getLabelStore().getAllLabel().then(labels=>{
      this.model.setLabels(labels);
    });
  }

  public setProject(project:Project):void{
    this.model.setProject(project);
  }

  public addTask(task:Task){
    if(task.getProjectID()==this.model.getProject().getId()){
      this.model.addTask(task);
    }
  }

  public onCreateTaskClick(){
    this.model.setAddingTaskMode(true);
    FocusHelper.focus(this.TASK_NAME_INPUT);
    this.scrollTaskListToBottom();
  }

  public onTaskMenuClick(mouseEvent: MouseEvent, task:Task){
    mouseEvent.stopPropagation();
    this.model.setTaskWithOpenMenu(task);
    // TODO: wymyślić, w jakis sposbó zaznaczyć element 
  }


  public onEditTask(task:Task){
    // TODO: można spróbować pobrać z bazy i przekazać dalej. Może rozwiązać problem pracy na jednym obiekcie
    // this.detailsEvent.emit(this.model.getTaskWithOpenMenu());
    this.detailsEvent.emit(task);
    this.model.setTaskWithOpenMenu(null);
  }

  public onRemoveTask(){
    const message = "Czy na pewno usunąć zadanie?";
    DialogHelper.openDialog(message, this.dialog).subscribe(result=>{
      if(result){
        this.removeTask();
      }
    });
  }

  private removeTask():void{
    const taskId = this.model.getTaskWithOpenMenu().getId();
    DataService.getStoreManager().getTaskStore().removeTask(taskId).then(()=>{
      this.model.removeTask(this.model.getTaskWithOpenMenu());
      this.removeEvent.emit(taskId);
      this.model.setTaskWithOpenMenu(null);
    });
  }

  public getEndDateText(task:Task){
    // TODO: zrobić odpowiedni format
    return task.getEndDate().toDateString();
  }

  // TODO: przenieść to do html
  public getSubtasksList(task:Task){
    let text = "<ul class='tooltip-list'>";
    task.getSubtasks().forEach(subtask=>{
      text += "<li>"+ subtask.getName()+"</li>"
    });
    text+= "</ul>";
    return text;
  }

  public addNewTask(){
    this.saveTask();
  }

  private saveTask(){
    const task = new Task();
    task.setName(this.model.getNewTaskName());
    task.setProject(this.model.getProject());
    DataService.getStoreManager().getTaskStore().createTask(task).then(insertedTask=>{
      this.model.addTask(insertedTask);
      this.closeAddingNewTask();
      this.scrollTaskListToBottom();
    });
  }

  private scrollTaskListToBottom(){
    let scrollContainer = $(this.TASK_LIST);
    setTimeout(()=>{
      scrollContainer.animate({ scrollTop: $(document).height() }, 1000);;
    },0); 
  }

  public closeAddingNewTask(){
    this.model.setNewTaskName("");
    this.model.setAddingTaskMode(false);
  }

  public handleAddingNewTaskKeyUp(event:KeyboardEvent){
    if(event.keyCode == KeyCode.ENTER){
      this.addNewTask();
    } 
    if(event.keyCode == KeyCode.ESC){
      this.closeAddingNewTask();
    }
  }

  public getPriorityText(task:Task):string{
    // TODO: pomyśleć nad oznaczeniem ważnośći zadania
    switch(task.getPriority()){
      case Priority.LEVEL_1:
        return '1';
      case Priority.LEVEL_2:
        return "2";
      case Priority.LEVEL_3:
        return "3";
      case Priority.LEVEL_4:
        return "4";
      case Priority.LEVEL_5:
        return "5";
      default:
        return "0";
    }
  }

  public toggleTaskImportance(task:Task, event:MouseEvent){
    task.setImportant(!task.isImportant());
    this.updateTask(task);
    event.stopPropagation();
  }

  private updateTask(task:Task){
    DataService.getStoreManager().getTaskStore().updateTask(task);
  }

  public clearFilter(){
    this.model.getFilter().clear();
    this.searchFilter();
  }

  // TODO: prawdopodobnie będzie trzeba to gdzieś przenieść
  public searchFilter(){
    let resultFilter = this.model.getProject().getTasks();
    const filter = this.model.getFilter();
    if(filter.isImportant()){
      resultFilter = resultFilter.filter(x=>x.isImportant());
    }
    if(filter.isWithEndDate()){
      resultFilter = resultFilter.filter(x=>x.getEndDate()!=null);
    }
    if(filter.getStatus() != null){
      resultFilter = resultFilter.filter(x=>x.getStatus()==filter.getStatus());
    }
    if(filter.getStage() != null){
      resultFilter = resultFilter.filter(x=>x.getProjectStageID() == filter.getStage().getId());
    }
    if(filter.getLabel() != null){
      // TODO: spróbować to napisać jakoś lepiej
      resultFilter = resultFilter.filter(x=>{
        let indices = [];
        x.getLabels().forEach(label=>indices.push(label.getId()));
        return indices.includes(filter.getLabel().getId());
        
      });
    }

    this.model.setTasks(resultFilter);
  }

}
