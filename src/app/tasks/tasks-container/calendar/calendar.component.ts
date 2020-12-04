import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AppService } from "app/core/services/app/app.service";
import { Project } from "app/database/data/models/project";
import { Task } from "app/database/data/models/task";
import { ITaskContainer } from "app/database/data/models/task.container";
import { ITaskItem } from "app/database/data/models/task.item";
import { ListHelper } from "app/shared/common/lists/list.helper";
import { DialogModel } from "app/tasks/creating-dialog/dialog.model";
import { CreatingDialogHelper } from "app/tasks/creating-dialog/helper";
import { TasksService } from "app/tasks/tasks.service";
import { ITaskList } from "../task.list";
import { CalendarCreator } from "./calendar/calendar.creator";
import { DateChanger } from "./actions/date.changer";
import { CellDraging } from "./actions/day.dragging";
import { DropIdsCreator } from "./calendar/names";
import { ITaskSelection } from "./selection/selection";
import { VariousTaskSelection } from "./selection/selection.many.manager";
import { ManyTaskTransfer } from "./selection/task.transfer";
import { TaskDay } from "./task.day";
import { ICalendarDate, DateModel } from "./models/date.model";
import { ICalendarTasks, TasksModel } from "./models/tasks.model";
import { ICalendarView, ViewModel } from "./models/view.model";
import { CalendarFilterFactory } from "./loader/filter.factory";
import { CalendarSettings, DateOption, TaskStatus } from "./loader/calendar.settings";
import { TaskLoader } from "./loader/task.loader";
import { DataService } from 'app/data.service';

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"],
})
export class CalendarComponent implements OnInit, ITaskList, AfterViewInit {
  public taskStatus = TaskStatus;
  public dateOption = DateOption;

  private _currentDate;
  private _showSettings: boolean;

  private _project: Project;
  private _dateModel: ICalendarDate;
  private _tasksModel: ICalendarTasks;
  private _viewModel: ICalendarView;

  private _calendarSettings: CalendarSettings = new CalendarSettings();
  private _cellDraggingController: CellDraging;
  private _taskTransfer: ManyTaskTransfer = new ManyTaskTransfer();
  private _selectionManager: ITaskSelection = new VariousTaskSelection();
  private _taskLoader: TaskLoader;
  private _dropIdsCreator: DropIdsCreator;
  private _dateChanger: DateChanger;

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  public get draggingController() {
    return this._cellDraggingController;
  }

  public get date(): ICalendarDate {
    return this._dateModel;
  }

  public get tasks(): ICalendarTasks {
    return this._tasksModel;
  }

  public get view(): ICalendarView {
    return this._viewModel;
  }

  public get idsCreator(): DropIdsCreator {
    return this._dropIdsCreator;
  }

  public get settings(): CalendarSettings {
    return this._calendarSettings;
  }

  public get showSettings(): boolean {
    return this._showSettings;
  }

  constructor(
    private appService: AppService,
    private tasksService: TasksService,
    private dialog: MatDialog,
    private dataService: DataService
  ) {
    this._currentDate = new Date();
    this._cellDraggingController = new CellDraging((previousId, currentId) => {
      this._dateChanger.changeDateManyTasks(previousId, currentId);
    });
    this._tasksModel = new TasksModel();
    this._dateModel = new DateModel(() => this.createCalendar());
    this._viewModel = new ViewModel();

    this._dropIdsCreator = new DropIdsCreator(this._tasksModel);
    this._dateChanger = new DateChanger(
      this._tasksModel,
      this._viewModel,
      this._dropIdsCreator,
      dialog,
      dataService
    );

    this._taskLoader = new TaskLoader(dataService);
  }

  private createCalendar() {
    const month = this._dateModel.month;
    const year = this._dateModel.year;
    this._tasksModel.cells = CalendarCreator.createCalendar(month, year);
    this.loadTasks();
    this._taskTransfer.init(this._tasksModel);
  }

  public openProject(project: Project): void {
    this._project = project;
    this.createCalendar();
    // TODO: sprawdzić, czy obecna data będzie działała poprawnie
  }

  private loadTasks() {
    this._selectionManager.deselectAll();
    this._tasksModel.clearTasks();
    this._taskLoader.loadTasks(this._tasksModel, this._project).then(result => {
      this._tasksModel.cells = result.cells;
      this._tasksModel.tasksWithoutDate = result.tasksWithoutDate;
      this._taskTransfer.init(this._tasksModel);
    });
  }

  public removeTask(task: ITaskItem): void {
    this.tasksService.removeTask(task).then((updatedTasks) => {
      if (updatedTasks != null) {
        this.removeTaskFromDay(task as Task);
      }
    });
  }

  private removeTaskFromDay(task: Task) {
    if (task.getDate() != null) {
      const cell = this._tasksModel.findCell(task.getDate());
      if (cell) {
        ListHelper.remove(task, cell.tasks);
      } else {
        const selectedDay = this._viewModel.selectedDay;
        if (selectedDay && this.isCorrectCell(selectedDay, task.getDate())) {
          ListHelper.remove(task, selectedDay.tasks);
        }
      }
    } else {
      ListHelper.remove(task, this._tasksModel.tasksWithoutDate);
    }
  }

  private isCorrectCell(x: TaskDay, date: Date): boolean {
    return x.month == date.getMonth() && x.day == date.getDate() && x.year == date.getFullYear();
  }

  public removeManyTasks() {
    const tasksToRemove = this._selectionManager.getSelectedTasks(null);
    this.tasksService.removeManyTasks(tasksToRemove).then((updated) => {
      tasksToRemove.forEach((task) => {
        this.removeTaskFromDay(task);
      });
    });
    this._selectionManager.deselectAll();
  }

  public openDetails(task: Task): void {
    this.tasksService.openDetails(task);
  }

  // TODO: zastanowić się, czy to powinno wyglądać w ten sposób. Czy to daje nam jakieś korzyści
  public addTask(task: ITaskItem, container: ITaskContainer = null): void {}

  public taskDrop(event: CdkDragDrop<Task[]>) {
    const task = event.previousContainer.data[event.previousIndex];

    // TODO: być może odznaczyć można jeszcze przed działaniem, będzie to lepiej wyglądało
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (this._selectionManager.isSelected(task)) {
        const selectedTasks = this._selectionManager.getSelectedTasks(event.previousContainer.data);
        // this.transferManyItems(event.previousContainer.data, event.container.data, selectedTasks, event.currentIndex);
        this._taskTransfer.transferItems(event.container.data, event.currentIndex, selectedTasks);
        this._dateChanger.changeManyDates(selectedTasks, event.container.id);
      } else {
        const task = event.previousContainer.data[event.previousIndex];
        this._dateChanger.changeDate(task, event.container.id);
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      }
    }
    this._selectionManager.deselectAll();
  }

  public getCurrentTasks() {
    const selectedDay = this._viewModel.selectedDay;
    if (selectedDay) {
      return selectedDay.tasks;
    }
    return [];
  }

  public getSelectedDate() {}

  public menuClick(mouseEvent: MouseEvent, task: Task) {
    mouseEvent.stopPropagation();
  }

  public setActiveTask(task: Task) {
    this.appService.setCurrentTask(task);
  }

  public isActiveTask(task: Task): boolean {
    return this.appService.getCurrentTask() == task;
  }

  public removeActiveTask() {
    this.appService.setCurrentTask(null);
  }

  public finishTask(task: Task) {
    this.tasksService.finishTask(task).then((updatedTasks) => {
      // TODO: zastanowić się i zaktualizować widok
    });
  }

  public openCreatingDialog(cell: TaskDay) {
    const data = new DialogModel("", this._project, this.getDate(cell), (model) => {
      if (model) {
        this.tasksService.addTask(model.name, model.project, null, model.date).then((result) => {
          cell.addTask(result.insertedElement);
        });
      }
    });
    CreatingDialogHelper.openDialog(data, this.dialog);
    return false;
  }

  private getDate(cell: TaskDay) {
    return new Date(cell.year, cell.month, cell.day);
  }

  public isCurrentDay(cell: TaskDay) {
    return (
      this._currentDate.getDate() == cell.day &&
      this._currentDate.getMonth() == cell.month &&
      this._currentDate.getFullYear() == cell.year
    );
  }

  public isSelected(task: Task): boolean {
    return this._selectionManager.isSelected(task);
  }

  public onTaskClick(task: Task, event: MouseEvent) {
    if (event.ctrlKey) {
      this._selectionManager.selectTask(task);
    } else if (event.shiftKey) {
      this._selectionManager.selectMany(task, this._tasksModel.tasksWithoutDate);
    } else {
      this._selectionManager.deselectAll();
      // TODO: tutaj być może będzie trzeba sprawdzić, czy to jest odpowieni tym
    }
  }

  public onDayClick(day: TaskDay, event: MouseEvent) {
    this.view.selectDay(day);
    event.preventDefault();
  }

  public getTasksNumber(cell: TaskDay): number {
    return cell.tasks.length;
  }

  public isManySelected(): boolean {
    return this._selectionManager.isManySelected();
  }

  public close() {
    this._selectionManager.deselectAll();
  }

  public changeStatusOption() {
    const statusFilter = CalendarFilterFactory.createStatusOption(
      this._calendarSettings.taskStatus,
    );
    this._taskLoader.setStatusFilter(statusFilter);
    this.loadTasks();
  }

  public changeDateOption() {
    const dateFilter = CalendarFilterFactory.createDateOption(this._calendarSettings.dateOption);
    this._taskLoader.setDateFilter(dateFilter);
    this.loadTasks();
  }

  public toggleShowSettings() {
    this._showSettings = !this._showSettings;
  }
}
