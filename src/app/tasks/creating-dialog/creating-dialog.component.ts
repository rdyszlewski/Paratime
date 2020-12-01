import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from 'app/database/data/models/task';
import { DialogModel } from './dialog.model';

@Component({
  selector: 'app-creating-dialog',
  templateUrl: './creating-dialog.component.html',
  styleUrls: ['./creating-dialog.component.css']
})
export class CreatingDialogComponent implements OnInit {

  private _model;

  public get model():DialogModel{
    return this._model;
  }

  constructor(public dialogRef: MatDialogRef<CreatingDialogComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: DialogModel) {
    this._model =data;
  }

  ngOnInit(): void {
  }

  closeDialog(){
    this.dialogRef.close();
    // this.dialogRef.close({event:'close'}); // TODO: coś tutaj ustawić
    //     this.dialogRef.close({ event: 'close', data: this.fromDialog });
  }

  public createTask(): Task{
    const task = new Task(this._model.name);
    task.setProject(this._model.project);
    task.setDate(this._model.date);
    return task;
  }

  public onOk(){
    this._model.callback(this._model);
    this.closeDialog();
  }
}
