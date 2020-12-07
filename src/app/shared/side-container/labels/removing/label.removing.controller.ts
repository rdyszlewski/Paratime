import { Label } from 'app/database/shared/label/label';
import { MatDialog } from '@angular/material/dialog';
import { LabelsModel } from '../common/list.model';
import { DialogHelper } from 'app/shared/common/dialog';
import { CommandService } from 'app/commands/manager/command.service';
import { RemoveLabelCommand } from 'app/commands/data-command/label/command.remove-label';

export class LabelRemovingController {

  constructor(
    private listModel: LabelsModel,
    private dialog: MatDialog,
    private commandService: CommandService
  ) {
    this.listModel = listModel;
    this.dialog = dialog;
  }

  public onRemoveLabel(label: Label) {
    const message = 'Czy na pewno usunąć etykietę?';
    DialogHelper.openDialog(message, this.dialog).subscribe((result) => {
      if (result) {
        this.removeLabel(label);
      }
    });
  }

  private removeLabel(label: Label) {
    this.commandService.execute(new RemoveLabelCommand(label, this.listModel));
  }
}
