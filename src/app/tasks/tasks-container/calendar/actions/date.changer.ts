import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'app/data.service';
import { Task } from 'app/database/shared/task/task';
import { DialogHelper } from 'app/shared/common/dialog';
import { DropIdsCreator } from '../calendar/names';
import { ICalendarTasks } from '../models/tasks.model';
import { ICalendarView } from '../models/view.model';
import { CalendarValues } from '../values';

export class DateChanger{


  constructor(private _tasksModel: ICalendarTasks, private _viewModel: ICalendarView, private _idsCreator: DropIdsCreator, private _dialog: MatDialog, private dataService: DataService){

  }

  public changeDate(task: Task, cellName: string){
    switch(cellName){
      case CalendarValues.WITHOUT_DATE:
        task.setDate(null);
        break;
      case CalendarValues.CURRENT_TASKS:
        console.log("CURRENT TASKS");
        console.log(this._viewModel.selectedDay);
        const currentCell = this._idsCreator.getCellId(this._viewModel.selectedDay);
        console.log(currentCell);
        this.changeTaskDate(task, currentCell); // TODO: trzeba sobie to sprawdzić
        break;
      default:
        this.changeTaskDate(task, cellName);
    }
    this.dataService.getTaskService().update(task);
  }

  private changeTaskDate(task:Task, cellName: string){
    const newDate = this.createDateFromCellId(cellName);
    task.setDate(newDate);
  }

  private createDateFromCellId(cellId: string) {
    const cellParts = cellId.split('_');
    const day = Number.parseInt(cellParts[1]);
    const month = Number.parseInt(cellParts[2]);
    const year = Number.parseInt(cellParts[3]);
    const newDate = new Date(year, month, day);
    return newDate;
  }

  // TODO: sprawdzić, czy czegoś tutaj nie zmienić, żeby było bardziej czytelne
  public changeDateManyTasks(previousCellId: string, currentCellId: string){
    this.showMoveAllTasksQuestion(previousCellId, currentCellId).then(answer=>{
      if(answer){
        this.changeDateAllTasksFromCells(previousCellId, currentCellId);
      }
    });
  }

  private showMoveAllTasksQuestion(previousCellId: string, currentCellId: string):Promise<boolean>{
    const previousDate = this.createDateFromCellId(previousCellId);
    const currentDate = this.createDateFromCellId(currentCellId);
    const message = "Czy na pewno przełożyć wszystkie zadania z dnia: " + previousDate.toLocaleDateString()
      + " na dzień: " + currentDate.toLocaleDateString() + " ?";
    return DialogHelper.openDialog(message, this._dialog).toPromise();
  }

  private changeDateAllTasksFromCells(previousCellId:string, currentCellId:string){
    const previousCell = this.findCell(previousCellId);
    const currentCell = this.findCell(currentCellId);
    previousCell.tasks.forEach(task=>{
      this.changeDate(task, currentCellId);
    });
    currentCell.tasks.push(...previousCell.tasks);
    previousCell.tasks = [];

  }

  private findCell(cellId: string){
    const date = this.createDateFromCellId(cellId);
    const cell = this._tasksModel.findCell(date);
    return cell;
  }

  // TODO: ta nazwa też chyba za bardzo nie pasuje
  public changeManyDates(tasks: Task[], cellId:string){
    tasks.forEach(task=>{
      this.changeDate(task, cellId);
    });
  }
}
