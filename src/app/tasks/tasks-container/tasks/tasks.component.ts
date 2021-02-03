import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { Task } from 'app/database/shared/task/task';
import { Status } from 'app/database/shared/models/status';
import { TasksModel } from './model';
import { TaskItemInfo } from './common/task.item.info';
import { TaskItemController } from './common/task.item.controller';
import { SpecialListTasks as SpecialListTask } from './common/special.list';
import { TaskFilteringController } from './filtering/task.filtering.controller';
import {
  CdkDragDrop,
} from '@angular/cdk/drag-drop';
import { DataService } from 'app/data.service';
import { TaskType } from './task.type';
import { ITaskContainer } from 'app/database/shared/task/task.container';
import { TaskOrderController } from './controllers/order.controller';
import { Subscribe, EventBus } from 'eventbus-ts';
import { ITaskList } from '../task.list';
import { SpecialList } from 'app/tasks/lists-container/projects/common/special_list';
import { AppService } from 'app/core/services/app/app.service';
import { TaskFilter } from 'app/database/shared/task/task.filter';
import { Project } from 'app/database/shared/project/project';
import { CommandService } from 'app/commands/manager/command.service';
import { RemoveTaskCommand } from 'app/commands/data-command/task/command.remove-task';
import { DialogService } from 'app/ui/widgets/dialog/dialog.service';
import { FinishTaskCommand } from 'app/commands/data-command/task/command.finish-task';
import { TaskRemoveDialog } from './dialog/task.remove-dialog';
import { RemoveTaskCallback } from 'app/commands/data-command/task/calback.task.remove-task';
import { TaskDetailsEvent } from '../events/details.event';
import { CreateTaskCommand } from 'app/commands/data-command/task/command.create-task';
import { ScrollBarHelper } from 'app/shared/common/view_helper';
import { InsertingTemplateComponent } from 'app/tasks/shared/inserting-template/inserting-template.component';
import { TaskInsertResult } from 'app/database/shared/task/task.insert-result';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.less'],
})
export class TasksComponent implements OnInit, ITaskList {
  private TASK_LIST = "#tasks-list";

  @ViewChild(InsertingTemplateComponent, {static:false})
  private insertingTemplate: InsertingTemplateComponent;

  public status = Status;
  public taskType = TaskType;

  private model: TasksModel;
  private itemInfo: TaskItemInfo; // TODO: przerobić metody dostepowe
  private itemController: TaskItemController; // TODO: tutaj będzie trzeba zmienić nazwę
  private specialListsController: SpecialListTask; // TODO: to na razie zostawimy
  private filteringController: TaskFilteringController;

  constructor(private appService: AppService, private dataService: DataService, private commandService: CommandService, private dialogService: DialogService) {
    this.model = new TasksModel();
    this.itemInfo = new TaskItemInfo();
    this.itemController = new TaskItemController(this.commandService);
    this.specialListsController = new SpecialListTask(this.model, this.dataService);
    this.filteringController = new TaskFilteringController(this.model, this.dataService);

    EventBus.getDefault().register(this);
  }

  close() {

  }

  ngOnInit(): void {}

  public getModel() {
    return this.model;
  }

  public getInfo() {
    return this.itemInfo;
  }

  public getItem() {
    return this.itemController;
  }

  public getSpecialList() {
    return this.specialListsController;
  }

  public getFiltering() {
    return this.filteringController;
  }

  public openProject(project: Project): void {
    if (!project || project.id < 0) {
      return;
    }
    this.model.setProject(project);
    this.loadTasks(TaskType.ACTIVE, project);
  }

  // TODO: to jest wykorzystywane w momencie pokazywania aktywnych i zakończonych zadań
  public loadTasks(taskType: TaskType, project = null) {
    const currentProject = project
      ? project
      : this.appService.getCurrentProject();
    let filterBuilder = TaskFilter.getBuilder().setProject(currentProject.id);
    if(taskType == TaskType.ACTIVE){
      filterBuilder.setActive(true);
    } else if(taskType == TaskType.FINISHED){
      filterBuilder.setFinished(true);
    }
    let filter = filterBuilder.build();
    this.dataService.getTaskService().getByFilter(filter).then(tasks=>{
      this.model.setTasks(tasks);
      this.model.setTaskType(taskType);
      this.model.isOpen // TODO: co to tutaj robi?!!!!
    });
  }

  private loadProjectTasks(project: Project, taskType: TaskType) {
    switch (taskType) {
      case TaskType.ACTIVE:
        let activeFilter = TaskFilter.getBuilder().setProject(project.id).setActive(true).build();
        return this.dataService.getTaskService().getByFilter(activeFilter);
      case TaskType.FINISHED:
        let finishedFilter = TaskFilter.getBuilder().setProject(project.id).setFinished(true).build();
        return this.dataService.getTaskService().getByFilter(finishedFilter);
    }
  }

  // TODO: sprawdzić, czy to jest gdziekoleiek wykorzystywane
  public addTask(task: Task, container: ITaskContainer = null) {
    if (task.projectID == this.model.getProject().id) {
      this.model.addTask(task);
    }
  }

  public onDrop(event: CdkDragDrop<string[]>) {
    TaskOrderController.onDrop(event, this.model.getTasks(), this.commandService);
  }

  // MENU
  public menuClick(mouseEvent: MouseEvent, task: Task) {
    mouseEvent.stopPropagation();
  }

  public removeTask(task: Task): void {
    TaskRemoveDialog.showSingleRemoveQuestion(task, this.dialogService, ()=>{
      let callback = new RemoveTaskCallback(this.model, task);
      this.commandService.execute(new RemoveTaskCommand(task).setCallback(callback));
    });
  }

  public openDetails(task: Task): void {
    // TODO: można to przenieść do polecenia
    EventBus.getDefault().post(new TaskDetailsEvent(task));
  }

  public setActiveTask(task: Task){
    this.appService.setCurrentTask(task);
  }

  public removeActiveTask(){
    this.appService.setCurrentProject(null);
  }

  public isActiveTask(task: Task){
    return this.appService.isCurrentTask(task);
  }

  public finishTask(task:Task){
    this.commandService.execute(new FinishTaskCommand(task, this.appService, (tasks)=>this.model.updateTasks(tasks)));
  }

  // TODO: to może zostać przeniesione do ListsContainer. Trzeba będzie pobrać zadania i je ustawić
  @Subscribe("SpecialListEvent")
  public onSpecialListLoad(type: SpecialList){
    this.specialListsController.setSpecialList(type)
  }

  public openInserting(){
    this.insertingTemplate.open();
  }

  public addNewTask(name: string){
    const project = this.model.getProject();
    let callback = (result) => this.updateViewAfterInserting(result);
    this.commandService.execute(new CreateTaskCommand(name, project).setCallback(callback));
  }

  public isInsertingOpen():boolean{
    if(this.insertingTemplate){
      return this.insertingTemplate.visible;
    }
    return false;
  }

  private updateViewAfterInserting(result: TaskInsertResult) {
    this.model.updateTasks(result.updatedElements);
    this.model.addTask(result.insertedElement);
    ScrollBarHelper.moveToBottom(this.TASK_LIST);
  }
}
