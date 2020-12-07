import { MatDialog } from '@angular/material/dialog';
import { UpdateTaskCommand } from 'app/commands/data-command/task/command.update-task';
import { CommandService } from 'app/commands/manager/command.service';
import { Task } from 'app/database/shared/task/task';
import { DialogHelper } from 'app/shared/common/dialog';
import { DialogService } from 'app/ui/widgets/dialog/dialog.service';
import { DropIdsCreator } from '../calendar/names';
import { ChangeDateDialog } from '../dialog/dialog.calendar.change-date';
import { ICalendarTasks } from '../models/tasks.model';
import { ICalendarView } from '../models/view.model';
import { CalendarValues } from '../values';

export class DateChanger{


  constructor(private _tasksModel: ICalendarTasks, private _viewModel: ICalendarView, private _idsCreator: DropIdsCreator, private dialogService: DialogService, private commandService: CommandService){

  }

  public changeDate(task: Task, cellName: string){
    switch(cellName){
      case CalendarValues.WITHOUT_DATE:
        task.setDate(null);
        break;
      case CalendarValues.CURRENT_TASKS:
        const currentCell = this._idsCreator.getCellId(this._viewModel.selectedDay);
        this.changeTaskDate(task, currentCell); // TODO: trzeba sobie to sprawdzić
        break;
      default:
        this.changeTaskDate(task, cellName);
    }
    this.commandService.execute(new UpdateTaskCommand(task));
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
    const previousDate = this.createDateFromCellId(previousCellId);
    const currentDate = this.createDateFromCellId(currentCellId);
    ChangeDateDialog.showManyDatesQuestion(previousDate, currentDate, this.dialogService, ()=>{
      this.changeDateAllTasksFromCells(previousCellId, currentCellId);
    })
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
