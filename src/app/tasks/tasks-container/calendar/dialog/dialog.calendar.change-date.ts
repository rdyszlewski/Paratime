import { DialogService } from 'app/ui/widgets/dialog/dialog.service';

export class ChangeDateDialog{

  public static showManyDatesQuestion(previousDate: Date, currentDate: Date, dialogService: DialogService, action: ()=>void){
    const message = "Czy na pewno przełożyć wszystkie zadania z dnia: " + previousDate.toLocaleDateString()
      + " na dzień: " + currentDate.toLocaleDateString() + " ?";
    dialogService.openQuestion(message, action);
  }
}
