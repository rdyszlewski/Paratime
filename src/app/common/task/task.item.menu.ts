import { Task } from 'app/data/models/task';
import { EventEmitter } from '@angular/core';
import { DialogHelper } from '../dialog';
import { MatDialog } from '@angular/material/dialog';

export interface ITaskItemMenuController{
    onMenuButtonClick(mouseEvent:MouseEvent);
    onEditTask(task:Task);
    onRemoveTask(task:Task);
}

export class TaskItemMenuController implements ITaskItemMenuController{

    private detailsEvent: EventEmitter<Task>;
    private removeEvent: EventEmitter<number>;
    private dialog: MatDialog;

    constructor(detailsEvent:EventEmitter<Task>, removeEvent:EventEmitter<number>,
        dialog:MatDialog){
        this.detailsEvent = detailsEvent;
        this.removeEvent = removeEvent;
    }

    public onMenuButtonClick(mouseEvent:MouseEvent) {
        mouseEvent.stopPropagation();
    }

    public onEditTask(task: Task) {
        this.detailsEvent.emit(task);
    }

    public onRemoveTask(task: Task) {
        this.showDialog().subscribe(result=>{
            if(result){
                this.removeTask(task);
            }
        })
    }

    private showDialog(){
        const message = "Czy na pewno usunąć zadanie?";
        return DialogHelper.openDialog(message, this.dialog);
    }

    private removeTask(task:Task){

    }

}
