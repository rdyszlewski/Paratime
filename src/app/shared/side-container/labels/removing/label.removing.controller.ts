import { Label } from 'app/database/data/models/label';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'app/data.service';
import { LabelsModel } from '../common/list.model';
import { DialogHelper } from 'app/shared/common/dialog';
import { EventBus } from 'eventbus-ts';
import { LabelsUpdateEvent } from '../events/update.event';

export class LabelRemovingController {

  constructor(
    private listModel: LabelsModel,
    private dialog: MatDialog,
    private dataService: DataService
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
    this.dataService.getLabelService().remove(label).then(updatedLabels=>{
      this.listModel.updateLabels(updatedLabels);
      EventBus.getDefault().post(new LabelsUpdateEvent(null));
    });
  }
}
