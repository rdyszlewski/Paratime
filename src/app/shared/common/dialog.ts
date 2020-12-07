import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'app/ui/widgets/dialog/dialog.component';

// TODO: przerobić to na dialogService
export class DialogHelper{

    public static openDialog(message:string, dialog:MatDialog){
        const dialogRef = dialog.open(DialogComponent,
            {width:"350px", data: message});
          return dialogRef.afterClosed();
    }


}
