import { MatDialog } from '@angular/material/dialog';
import { CreatingDialogComponent } from './creating-dialog.component';
import { DialogModel } from './dialog.model';

// TODO: sprawdzić, czy to będzie potrzebne
export class CreatingDialogHelper{
  public static openDialog(data:DialogModel,dialog:MatDialog){
    const dialogRef = dialog.open(CreatingDialogComponent, {width:"350px", data: data});
    return dialogRef.afterClosed();
  }
}
