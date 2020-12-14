import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  public openQuestion(message: string, onYesAction: ()=>void){
    this.openDialog(message, this.dialog).subscribe(answer=>{
      if(answer){
        onYesAction();
      }
    })
  }

  public openDialog(message:string, dialog:MatDialog){
    const dialogRef = dialog.open(DialogComponent,
        {width:"350px", data: message});
      return dialogRef.afterClosed();
}
}
